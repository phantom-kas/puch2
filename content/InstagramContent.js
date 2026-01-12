// content/instagram.js

// import { getCookie } from "../utils/Helpers";
// import { runUpdateStoryFlow } from "./automation/updateStoryFlow";



function getCookie(name) {
  return document.cookie
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(name + "="))
    ?.split("=")[1] || null;
}

 async function runUpdateStoryFlow(params,SendMessage) {
  try {
    // Security checks
    if (!checkPageSecurity(SendMessage)) {
      return;
    }
    
    // Generate random delays for human-like behavior
    const delays = {
      d: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      V: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      M: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      B: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      h: getRandomInt(2000, 2300),
      v: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      C: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      O: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      ba: getRandomDelay(CONFIG.DELAYS.MEDIUM),
      ia: getRandomDelay(CONFIG.DELAYS.LONG)
    };
    
    // Generate action flags using probability functions
    const actionFlags = {
      willFollow: shouldPerformAction(CONFIG.PROBABILITIES.FOLLOW),
      willLike: shouldPerformAction(CONFIG.PROBABILITIES.LIKE),
      willUnfollow: shouldPerformAction(CONFIG.PROBABILITIES.UNFOLLOW),
      willDM: shouldPerformAction(CONFIG.PROBABILITIES.DM),
      willReact: shouldPerformAction(CONFIG.PROBABILITIES.REACT)
    };
    
    // Start story interaction flow
    await sleep(delays.h);
    
    const username = getCurrentUsername();
    
    // Click view story button
    await clickViewStoryButton();
    
    // Setup reply field after delay
    await sleep(1000);
    await setupReplyField(params);
    
    // Generate and display status message
    const statusMessage = generateStatusMessage(params, actionFlags);
    updateStatus(statusMessage);
    sendMessageSafe('SkipFollowStory', 'text', statusMessage,SendMessage);
    
    // Random error reporting (only if probability threshold met)
    if (shouldPerformAction(CONFIG.PROBABILITIES.ERROR_REPORT)) {
      sendMessageSafe('ErrorStory', 'Error', 'No Buttons',SendMessage);
    }
    
    // Determine if any actions should be performed
    const shouldAct = 
      (actionFlags.willFollow && params.story.StartFollow && params.story.FollowPoolSize < params.story.maxFollows) ||
      (actionFlags.willLike && params.story.StartLike && params.story.LikePoolSize < params.story.maxLikes) ||
      (actionFlags.willUnfollow && params.story.StartUnfollow && params.story.UnfollowPoolSize < params.story.maxUnfollows) ||
      params.story.getStats ||
      (actionFlags.willDM && params.story.StartComment);
    
    if (shouldAct) {
      const targetUsername = window.location.href.split('/')[4];
      
      // Save navigation state
      navigationState.save({
        actionFlags,
        delays,
        timestamp: Date.now()
      });
      
      sendMessageSafe('GetFollowLike', 'User', {
        dofollow: actionFlags.willFollow,
        dolike: actionFlags.willLike,
        dounfollow: actionFlags.willUnfollow,
        dodm: actionFlags.willDM
      },SendMessage);
      
      // Navigate to user profile
      window.location.href = `https://instagram.com/${targetUsername}`;
      
      // Continue after navigation completes
      window.addEventListener('load', async () => {
        const savedState = navigationState.load();
        if (savedState) {
          await handleProfileActions(params, savedState.actionFlags, savedState.delays,SendMessage);
          navigationState.clear();
        }
      }, { once: true });
    }
    
  } catch (error) {
    console.error('Story flow error:', error);
    sendMessageSafe('FlowError', 'Error', {
      message: error.message,
      stack: error.stack
    },SendMessage);
    updateStatus('Error occurred - check console');
  }
}


let StoryContext = null;
let story_set = false;
let startedFollowLike = false;


let port = chrome.runtime.connect({ name: "instagram-content" });

port.onMessage.addListener(onMessageReceive);

document.addEventListener("DOMContentLoaded", () => {
  retrieveUserHeaders();
  detectPageContext();
});

function retrieveUserHeaders() {
  const csrf = getCookie("csrftoken");
  const userId = getCookie("ds_user_id");

  port.postMessage({
    Tag: "UserHeaders",
    csrf,
    userId,
  });
}

function detectPageContext() {
  const url = window.location.href;

  if (url.includes("stories")) {
    port.postMessage({ Tag: "StoryPageDetected" });
  }

  if (url.includes("direct")) {
    port.postMessage({ Tag: "DMPageDetected" });
  }
}

function onMessageReceive(message) {
  // background tells content what to do
  const tag = message.tag;
  switch (tag){
    case 'UpdateStory' :{
      runUpdateStoryFlow(message)
    }
  }
}
