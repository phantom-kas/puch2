/**
 * Instagram Story Automation Flow - Refactored
 * Improved reliability, error handling, and DOM interaction patterns
 */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
  DELAYS: {
    SHORT: { min: 1000, max: 2200 },
    MEDIUM: { min: 2000, max: 4500 },
    LONG: { min: 9800, max: 10500 }
  },
  
  PROBABILITIES: {
    FOLLOW: 0.5,      // 50% chance (was threshold > 5 out of 10)
    LIKE: 0.6,        // 60% chance (was threshold > 4 out of 10)
    UNFOLLOW: 0.3,    // 30% chance (was threshold >= 7 out of 10)
    DM: 0.2,          // 20% chance (was threshold >= 8 out of 10)
    REACT: 0.2,       // 20% chance (was threshold > 16 out of 20)
    ERROR_REPORT: 0.3 // 30% chance for random error reporting
  },
  
  RETRIES: {
    MAX_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },
  
  SELECTORS: {
    VIEW_STORY_BUTTON: 'button[aria-label*="View"], button:has-text("View Story")',
    REPLY_TEXTAREA: 'textarea[placeholder*="Reply"]',
    FOLLOW_BUTTON: 'button:has-text("Follow"), button:has-text("Seguir"), button:has-text("S\'abonner")',
    UNFOLLOW_BUTTON: 'button:has-text("Unfollow"), button:has-text("Non seguire")',
    MESSAGE_BUTTON: 'button:has-text("Message")',
    SEND_BUTTON: 'button:has-text("Send")',
    REPORT_BUTTON: 'button:has-text("Report"), button:has-text("Informar")',
    LIKE_SVG: 'svg[aria-label*="Like"], svg[aria-label*="Gefällt mir"]'
  },
  
  LANGUAGE_STRINGS: {
    viewStory: ['View Story', 'jouer', 'Tap', 'Toca', 'Zum', 'Tocca'],
    follow: ['Follow', 'Seguir', 'S\'abonner', 'Segui', 'Abonnieren', 'Følg'],
    unfollow: ['Unfollow', 'Non seguire', 'folgen', 'seguir'],
    like: ['Like', 'Gefällt mir', 'Mi piace', 'To se mi líbí', 'J\'aime', 'Gilla', 'Me gusta', 'Vind ik leuk', 'Gosto'],
    message: ['Message'],
    send: ['Send', 'Enviar'],
    report: ['Report', 'Informar', 'Rapporto', 'Bericht']
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDelay(delayConfig) {
  return getRandomInt(delayConfig.min, delayConfig.max);
}

function shouldPerformAction(probability) {
  return Math.random() < probability;
}

function containsAny(text, searchTerms) {
  if (!text) return false;
  return searchTerms.some(term => text.includes(term));
}

function isUserInWhitelist(username, whitelist) {
  return whitelist && whitelist.includes(username);
}

// Wait for element with retry logic
async function waitForElement(selector, options = {}) {
  const { timeout = 5000, checkInterval = 100, parent = document } = options;
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const check = () => {
      const element = parent.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Element not found: ${selector}`));
        return;
      }
      
      setTimeout(check, checkInterval);
    };
    
    check();
  });
}

// Find element by text content with retry
function findElementByText(tagName, searchTerms, options = {}) {
  const { exactMatch = false, maxElements = 100 } = options;
  const elements = document.getElementsByTagName(tagName);
  const limit = Math.min(elements.length, maxElements);
  
  for (let i = 0; i < limit; i++) {
    const element = elements[i];
    if (!element?.innerText) continue;
    
    const text = element.innerText;
    const matches = exactMatch 
      ? searchTerms.some(term => text === term)
      : containsAny(text, searchTerms);
    
    if (matches) {
      return element;
    }
  }
  
  return null;
}

// Retry wrapper for DOM actions
async function retryAction(actionFn, actionName, maxAttempts = CONFIG.RETRIES.MAX_ATTEMPTS) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await actionFn();
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn(`${actionName} attempt ${attempt} failed:`, error);
    }
    
    if (attempt < maxAttempts) {
      await sleep(CONFIG.RETRIES.RETRY_DELAY * attempt);
    }
  }
  
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Throttled status updates
const statusUpdateQueue = [];
let lastStatusUpdate = 0;
const STATUS_THROTTLE_MS = 2000;

function updateStatus(message) {
  const now = Date.now();
  
  if (now - lastStatusUpdate < STATUS_THROTTLE_MS) {
    statusUpdateQueue.push(message);
    return;
  }
  
  lastStatusUpdate = now;
  const injectElement = document.getElementById('inject');
  if (injectElement) {
    injectElement.innerHTML = message;
  }
  
  // Process queue
  if (statusUpdateQueue.length > 0) {
    setTimeout(() => {
      const nextMessage = statusUpdateQueue.pop();
      statusUpdateQueue.length = 0; // Clear queue, only show latest
      if (nextMessage) {
        updateStatus(nextMessage);
      }
    }, STATUS_THROTTLE_MS);
  }
}

// Safe message sending - only after confirmation
function sendMessageSafe(type, category, data,SendMessage, condition = true) {
  if (!condition) {
    console.log(`Skipped message: ${type} - ${category} (condition not met)`);
    return false;
  }
  
  try {
    if (typeof SendMessage === 'function') {
      SendMessage(type, category, data);
      return true;
    }
  } catch (error) {
    console.error('Failed to send message:', error);
  }
  
  return false;
}

// Navigation state management (alternative to localStorage for session data)
const navigationState = {
  pendingActions: null,
  
  save(data) {
    this.pendingActions = data;
    // Could also use sessionStorage if needed:
    // sessionStorage.setItem('instagramFlowState', JSON.stringify(data));
  },
  
  load() {
    // Could also read from sessionStorage:
    // const stored = sessionStorage.getItem('instagramFlowState');
    // return stored ? JSON.parse(stored) : this.pendingActions;
    return this.pendingActions;
  },
  
  clear() {
    this.pendingActions = null;
    // sessionStorage.removeItem('instagramFlowState');
  }
};

// Wait for page navigation to complete
function waitForNavigation() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    
    window.addEventListener('load', () => resolve(), { once: true });
    
    // Fallback timeout
    setTimeout(() => resolve(), 3000);
  });
}

// ============================================
// PAGE DETECTION & SECURITY
// ============================================

function checkPageSecurity(SendMessage) {
  // Check for "page not available" message
  const bodyElements = document.getElementsByTagName('body');
  for (let i = 0; i < bodyElements.length; i++) {
    if (bodyElements[i]?.innerText?.includes("Sorry, this page isn't available.")) {
      sendMessageSafe('BadTarget', 'Media', '',SendMessage);
      return false;
    }
  }
  
  const pageHTML = document.documentElement.innerHTML;
  
  // Handle email signup redirect
  if (window.location.href.includes('accounts/emailsignup/')) {
    window.location.replace('https://instoo.com/pause');
    return false;
  }
  
  // Check for security warnings
  const securityChecks = [
    { text: 'It looks like you shared your password', type: 'compromised' },
    { text: 'entering your password on a website designed', type: 'phishing' },
    { text: 'unusual activity from your account', type: 'unusual' }
  ];
  
  for (const check of securityChecks) {
    if (pageHTML.includes(check.text)) {
      sendMessageSafe('blocked', 'blocked', check.type + window.location.href,SendMessage);
      setTimeout(() => {
        window.location.replace('https://instagram.com/accounts/logout');
      }, 20000);
      return false;
    }
  }
  
  return true;
}

async function checkForBlockMessage(SendMessage) {
  const reportButton = findElementByText('button', CONFIG.LANGUAGE_STRINGS.report);
  
  if (reportButton) {
    sendMessageSafe('blocked', 'blocked', 'Account blocked - report button detected',SendMessage);
    reportButton.click();
    
    await sleep(2000);
    window.location.replace('https://instagram.com/accounts/logout');
    return true;
  }
  
  return false;
}

// ============================================
// STORY INTERACTION FUNCTIONS
// ============================================

async function clickViewStoryButton() {
  const action = async () => {
    // Try buttons first
    let button = findElementByText('button', CONFIG.LANGUAGE_STRINGS.viewStory);
    if (button) {
      button.click();
      await sleep(500);
      return true;
    }
    
    // Try divs as fallback
    const div = findElementByText('div', CONFIG.LANGUAGE_STRINGS.viewStory);
    if (div) {
      div.click();
      await sleep(500);
      return true;
    }
    
    return false;
  };
  
  return await retryAction(action, 'Click View Story');
}

async function setupReplyField(config) {
  try {
    const textareas = document.getElementsByTagName('textarea');
    
    for (const textarea of textareas) {
      const placeholder = textarea.getAttribute('placeholder');
      if (placeholder?.includes('Reply')) {
        textarea.click();
        textarea.focus();
        textarea.selectionEnd = 0;
        
        // Dispatch events
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        textarea.dispatchEvent(new Event('click', { bubbles: true }));
        textarea.dispatchEvent(new Event('focus', { bubbles: true }));
        
        return true;
      }
    }
  } catch (error) {
    console.error('Failed to setup reply field:', error);
  }
  
  return false;
}

// ============================================
// USER VALIDATION
// ============================================

function extractFollowerCount(element) {
  const title = element.firstElementChild?.getAttribute('title');
  if (!title || title.length <= 1) return null;
  
  return parseInt(title.split(',').join('').split('.').join(''));
}

function validateUserProfile(config) {
  const validation = {
    isBlocked: false,
    blockReason: '',
    imageContent: '',
    followerCount: null,
    followingCount: null
  };
  
  if (!config.story.EnableFilters) {
    return validation;
  }
  
  const main = document.getElementsByTagName('main')[0];
  const images = document.getElementsByTagName('img');
  
  // Check image content
  for (const img of images) {
    const alt = img.getAttribute('alt');
    if (alt?.includes('May be a')) {
      const content = alt.split('May be a')[1];
      validation.imageContent += content;
      
      for (const filter of config.story.filters) {
        if (content.toLowerCase().includes(filter)) {
          validation.isBlocked = true;
          validation.blockReason = `Blocked: image contains "${filter}"`;
          return validation;
        }
      }
    }
  }
  
  // Check bio text
  if (main?.firstElementChild) {
    const bioText = main.firstElementChild.innerText.toLowerCase();
    for (const filter of config.story.filters) {
      if (bioText.includes(filter)) {
        validation.isBlocked = true;
        validation.blockReason = `Blocked: bio contains "${filter}"`;
        return validation;
      }
    }
  }
  
  // Check minimum photos
  if (images.length < config.story.minPhotos) {
    validation.isBlocked = true;
    validation.blockReason = `Blocked: only ${images.length} photos (min: ${config.story.minPhotos})`;
    return validation;
  }
  
  // Check follower/following counts
  const links = document.querySelectorAll('a[href*="/followers"], a[href*="/following"]');
  
  for (const link of links) {
    const href = link.getAttribute('href');
    const count = extractFollowerCount(link);
    
    if (!count) continue;
    
    if (href.includes('followers')) {
      validation.followerCount = count;
      
      if (count > config.story.maxFollowers) {
        validation.isBlocked = true;
        validation.blockReason = `Blocked: ${count} followers exceeds max ${config.story.maxFollowers}`;
        return validation;
      }
      
      if (count < config.story.minFollowers) {
        validation.isBlocked = true;
        validation.blockReason = `Blocked: ${count} followers below min ${config.story.minFollowers}`;
        return validation;
      }
    }
    
    if (href.includes('following')) {
      validation.followingCount = count;
      
      if (count > config.story.maxFollowing) {
        validation.isBlocked = true;
        validation.blockReason = `Blocked: ${count} following exceeds max ${config.story.maxFollowing}`;
        return validation;
      }
      
      if (count < config.story.minFollowing) {
        validation.isBlocked = true;
        validation.blockReason = `Blocked: ${count} following below min ${config.story.minFollowing}`;
        return validation;
      }
    }
  }
  
  return validation;
}

// ============================================
// ACTION HANDLERS
// ============================================

async function followUser(username,SendMessage) {
  const action = async () => {
    const button = findElementByText('button', CONFIG.LANGUAGE_STRINGS.follow);
    
    if (!button) {
      return false;
    }
    
    button.click();
    await sleep(1000);
    
    // Verify the follow action succeeded by checking button text changed
    const buttonAfter = findElementByText('button', ['Following', 'Requested']);
    const succeeded = buttonAfter !== null;
    
    if (succeeded) {
      sendMessageSafe('FollowedUserStory', 'User', {
        followed_time: Date.now(),
        full_name: '',
        user_id: '0',
        user_pic_url: 'icon.png',
        username: username
      },SendMessage, true);
    }
    
    // Check for blocks
    await sleep(2000);
    await checkForBlockMessage(SendMessage);
    
    return succeeded;
  };
  
  return await retryAction(action, 'Follow User');
}

async function unfollowUser(config) {
  // Navigate to following list
  const followingLink = document.querySelector('a[href*="/following/"]:not([href*="hashtag"])');
  
  if (!followingLink) {
    console.warn('Following link not found');
    return false;
  }
  
  followingLink.click();
  await sleep(getRandomDelay(CONFIG.DELAYS.MEDIUM));
  
  // Process unfollow list
  return await processUnfollowList(config);
}

async function processUnfollowList(config) {
  const links = document.querySelectorAll('a.notranslate[title]');
  
  for (const link of links) {
    const username = link.getAttribute('title');
    
    if (!username || username.length <= 1) continue;
    
    // Check whitelist
    if (isUserInWhitelist(username, config.story.Whitelist)) {
      continue;
    }
    
    // Check blacklist if unfollowInstoo is enabled
    if (config.story.unfollowInstoo && !config.story.blacklist.includes(username)) {
      continue;
    }
    
    // Find and click unfollow button
    const unfollowButton = findUnfollowButtonForLink(link);
    if (unfollowButton) {
      unfollowButton.click();
      await sleep(2000);
      
      const confirmed = await confirmUnfollow(username,SendMessage);
      if (confirmed) {
        return true; // Only unfollow one user at a time
      }
    }
  }
  
  return false;
}

function findUnfollowButtonForLink(link) {
  // Try different parent hierarchy levels to find the unfollow button
  let current = link;
  
  for (let i = 0; i < 6; i++) {
    current = current.parentNode;
    if (!current) break;
    
    const nextSibling = current.nextSibling;
    if (nextSibling?.firstElementChild) {
      const button = nextSibling.firstElementChild;
      if (button.tagName === 'BUTTON') {
        return button;
      }
    }
  }
  
  return null;
}

async function confirmUnfollow(username,SendMessage) {
  const action = async () => {
    const button = findElementByText('button', CONFIG.LANGUAGE_STRINGS.unfollow);
    
    if (!button) {
      return false;
    }
    
    button.click();
    await sleep(1000);
    
    // Verify unfollow succeeded
    const followButton = findElementByText('button', CONFIG.LANGUAGE_STRINGS.follow);
    const succeeded = followButton !== null;
    
    if (succeeded) {
      sendMessageSafe('UnfollowedUser', 'User', {
        username,
        user_id: username,
        full_name: username,
        user_pic_url: 'icon.png',
        unfollowed_time: Date.now()
      },SendMessage, true);
    }
    
    await sleep(2000);
    await checkForBlockMessage(SendMessage);
    
    return succeeded;
  };
  
  return await retryAction(action, 'Unfollow User');
}

async function likePost(config,SendMessage) {
  const action = async () => {
    const svgs = document.querySelectorAll('svg[aria-label]');
    
    for (const svg of svgs) {
      const ariaLabel = svg.getAttribute('aria-label');
      
      if (containsAny(ariaLabel, CONFIG.LANGUAGE_STRINGS.like)) {
        const likeButton = svg.parentNode;
        likeButton.click();
        await sleep(1000);
        
        // Verify like succeeded by checking aria-label changed to "Unlike"
        const ariaLabelAfter = svg.getAttribute('aria-label');
        const succeeded = ariaLabelAfter && !containsAny(ariaLabelAfter, CONFIG.LANGUAGE_STRINGS.like);
        
        if (succeeded) {
          sendMessageSafe('LikedMedia', 'Media', {
            caption: '',
            is_video: false,
            media_id: config.story.LikePoolSize,
            media_src: getImageSrc(),
            shortcode: getCurrentUsername(),
            liked_time: Date.now()
          },SendMessage, true);
        }
        
        await sleep(2000);
        await checkForBlockMessage(SendMessage);
        
        return succeeded;
      }
    }
    
    return false;
  };
  
  return await retryAction(action, 'Like Post');
}

function getImageSrc() {
  const images = document.querySelectorAll('img[src]');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (src && src.length > 1 && !src.includes('data:')) {
      return src;
    }
  }
  return 'icon.png';
}

function getCurrentUsername() {
  const links = document.getElementsByTagName('a');
  return links[1]?.text || window.location.pathname.split('/')[1] || '';
}

// ============================================
// STATUS & MESSAGING
// ============================================

function generateStatusMessage(config, actionFlags) {
  const { story } = config;
  const speedNames = ['fast', 'fast', 'medium', 'slow'];
  
  let status = `Speed: ${speedNames[story.currentSpeed]} | `;
  
  const actions = [];
  
  if (story.StartFollow && actionFlags.willFollow) {
    actions.push(`Following ${story.storyUser}`);
  }
  
  if (story.StartLike && actionFlags.willLike) {
    actions.push(`Liking ${story.storyUser}`);
  }
  
  if (story.StartUnfollow && actionFlags.willUnfollow) {
    actions.push('Unfollowing');
  }
  
  if (story.StartComment && actionFlags.willDM) {
    actions.push('Sending DM');
  }
  
  if (story.StartReact && actionFlags.willReact) {
    actions.push('Reacting to Story');
  }
  
  if (actions.length > 0) {
    status += actions.join(', ');
  } else {
    status += 'Viewing (skipped actions to appear human)';
  }
  
  if (story.getStats) {
    status = 'Gathering follower stats';
  }
  
  return status;
}

// ============================================
// PROFILE ACTION HANDLER
// ============================================

async function handleProfileActions(config, actionFlags, delays,SendMessage) {
  // Wait for page to load
  await waitForNavigation();
  
  // Check if we're still on stories page (redirect failed)
  if (window.location.href.includes('stories')) {
    const username = window.location.href.split('/')[4];
    window.location.href = `https://instagram.com/${username}`;
    await waitForNavigation();
  }
  
  await sleep(2000);
  
  // Validate profile
  const validation = validateUserProfile(config);
  
  if (validation.isBlocked) {
    updateStatus(validation.blockReason);
    sendMessageSafe('ProfileBlocked', 'Filter', {
      reason: validation.blockReason,
      username: getCurrentUsername()
    },SendMessage);
    return;
  }
  
  // Update status with validation info
  if (validation.followerCount || validation.followingCount) {
    const validationMsg = `Profile validated: ${validation.followerCount || '?'} followers, ${validation.followingCount || '?'} following`;
    updateStatus(validationMsg);
  }
  
  // Perform actions with proper delays and verification
  const actionQueue = [];
  
  if (actionFlags.willFollow && 
      config.story.FollowPoolSize < config.story.maxFollows && 
      config.story.FollowPoolSize < 200) {
    actionQueue.push({
      name: 'follow',
      delay: 2000,
      action: () => followUser(getCurrentUsername(),SendMessage)
    });
  }
  
  if (actionFlags.willUnfollow && 
      config.story.UnfollowPoolSize < config.story.maxUnfollows && 
      config.story.UnfollowPoolSize < 200) {
    actionQueue.push({
      name: 'unfollow',
      delay: delays.ia,
      action: () => unfollowUser(config)
    });
  }
  
  if (!config.story.getStats && 
      actionFlags.willLike && 
      config.story.LikePoolSize < config.story.maxLikes && 
      config.story.LikePoolSize < 256) {
    actionQueue.push({
      name: 'like',
      delay: delays.V,
      action: () => likePost(config,SendMessage)
    });
  }
  
  // Execute actions sequentially
  for (const queuedAction of actionQueue) {
    await sleep(queuedAction.delay);
    
    updateStatus(`Attempting to ${queuedAction.name}...`);
    const success = await queuedAction.action();
    
    if (success) {
      updateStatus(`Successfully completed: ${queuedAction.name}`);
    } else {
      updateStatus(`Failed to ${queuedAction.name} after retries`);
      sendMessageSafe('ActionFailed', 'Error', {
        action: queuedAction.name,
        username: getCurrentUsername()
      },SendMessage);
    }
  }
}

// ============================================
// MAIN ENTRY POINT
// ============================================

/**
 * Main execution function for Instagram Story automation
 * @param {Object} params - Configuration object containing story settings
 * @returns {Promise<void>}
 */
export async function runUpdateStoryFlow(params,SendMessage) {
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