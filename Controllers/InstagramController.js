import { TabService } from "../services/TabService.js";
import { MessageService } from "../services/MessageService.js";
import { BaseController } from "./BaseController.js";
export class InstagramController extends BaseController {
  constructor(currentUser) {
    this.currentUser = currentUser;
    this.roundRobinHashtag = 0;
    this.roundRobinAccount = 0;
  }

  logTabsDM(tabs, msg, state) {
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const encodedUrl = encodeURIComponent(tab.url);

      if (encodedUrl.includes("instagram.com")) {
        TabService.openInstagram(msg.username);
        state.activeTab = i;
        state.likeError--;

        if (this.currentUser) {
          setTimeout(() => {
            if (this.currentUser) {
              MessageService.sendMessage(
                "DODM",
                "story",
                { username: this.currentUser.username, ...state },
                state.ComPortContent
              );
            }
          }, 10000);
        }
        break;
      }
    }
  }

  onMessageReceive(msg, sendResponse) {
    switch (message.tag) {
      case "UPDATE_STORY":
        this.send("STORY_UPDATE", "instagram", message.payload);
        break;
    }
  }

  async updateStory(delta) {
    if (!RuntimeState.StartStory || !RuntimeState.ComPortIndex) return;

    this.cleanupExtraInstagramTabs();

    // Update timer
    RuntimeState.StoryTime.Time -= delta;

    // Deduplicate AccountTargets
    RuntimeState.AccountTargets = [...new Set(RuntimeState.AccountTargets)];

    SendMessage(
      "Timer",
      "Time",
      RuntimeState.StoryTime.Time,
      RuntimeState.ComPortContent
    );

    // Case 1: No stories, tags available, no account targets
    if (
      RuntimeState.StoryTime.Time <= 0 &&
      RuntimeState.stories.length === 0 &&
      RuntimeState.TagPool.length > 0 &&
      RuntimeState.AccountTargets.length === 0
    ) {
      await this.openTagTab();
      return;
    }

    // Case 2: No stories, account targets exist
    if (
      RuntimeState.StoryTime.Time <= 0 &&
      RuntimeState.stories.length === 0 &&
      RuntimeState.AccountTargets.length > 0
    ) {
      await this.openAccountTab();
      return;
    }

    // Case 3: Stories available to watch
    if (RuntimeState.StoryTime.Time <= 0 && RuntimeState.stories.length > 0) {
      await this.watchNextStory();
      return;
    }
  }

  cleanupExtraInstagramTabs() {
    chrome.tabs.query(
      { url: "https://www.instagram.com/*", currentWindow: true },
      (tabs) => {
        if (tabs.length <= 1) return;
        for (let i = 1; i < tabs.length; i++) {
          chrome.tabs.remove(tabs[i].id, () => {});
        }
      }
    );
  }

  async openTagTab() {
    const tag =
      RuntimeState.TagPool[
        this.roundRobinHashtag % RuntimeState.TagPool.length
      ];
    this.roundRobinHashtag++;

    RuntimeState.StoryTime.Time = getRandomInt(
      RuntimeState.StorySettings.TimeMin,
      RuntimeState.StorySettings.TimeMax
    );

    chrome.tabs.query({ windowType: "normal" }, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url.includes("instagram.com")) {
          chrome.tabs.update(tab.id, {
            url: `https://www.instagram.com/explore/tags/${tag.tag_name}`,
          });
          setTimeout(
            () =>
              SendMessage(
                "gatherHashtags",
                "CurrentUser",
                "CurrentUser",
                RuntimeState.ComPortContent
              ),
            10000
          );
        }
      });
    });

    SaveDatabase();
  }

  async openAccountTab() {
    const account =
      RuntimeState.AccountTargets[
        this.roundRobinAccount % RuntimeState.AccountTargets.length
      ];
    this.roundRobinAccount++;
    RuntimeState.loopAccounts += account + ", ";

    RuntimeState.StoryTime.Time = getRandomInt(
      RuntimeState.StorySettings.TimeMin,
      RuntimeState.StorySettings.TimeMax
    );

    chrome.tabs.query({ windowType: "normal" }, (tabs) => {
      let updated = false;
      tabs.forEach((tab, i) => {
        if (!updated && tab.url.includes("instagram.com")) {
          const username = account.includes("https://")
            ? account.split("/")[3]
            : account;
          chrome.tabs.update(tab.id, {
            url: `https://www.instagram.com/${username}`,
          });
          updated = true;

          RuntimeState.last_story = {
            storyUser: username,
            timestamp: Date.now(),
          };
          setTimeout(
            () =>
              SendMessage(
                "GatherAccountTargets",
                "CurrentUser",
                username,
                RuntimeState.ComPortContent
              ),
            10000
          );
        }
      });

      if (!updated) {
        const username = account.includes("https://")
          ? account.split("/")[3]
          : account;
        chrome.tabs.create({ url: `https://www.instagram.com/${username}` });
      }
    });

    SaveDatabase();
  }

  async watchNextStory() {
    const idx = getRandomInt(0, RuntimeState.stories.length - 1);
    const media = RuntimeState.stories.splice(idx, 1)[0];

    RuntimeState.StoryMedia.push(media);
    RuntimeState.blacklist.push(media.username);

    RuntimeState.last_story = {
      username: media.username,
      target: media.target,
      timestamp: Date.now(),
    };

    SendMessage(
      "OnStoryMediaComplete",
      "Media",
      media,
      RuntimeState.ComPortIndex
    );

    RuntimeState.activity_log += `Instagram: Watched Story ${media.username} from target ${media.target},<br>`;

    chrome.tabs.query({ windowType: "normal" }, (tabs) => {
      let updated = false;
      tabs.forEach((tab, i) => {
        if (!updated && tab.url.includes("instagram.com")) {
          chrome.tabs.update(tab.id, {
            url: `https://www.instagram.com/stories/${media.username}`,
          });
          updated = true;
        }
      });

      if (!updated) {
        chrome.tabs.create({
          url: `https://www.instagram.com/stories/${media.username}`,
        });
      }
    });

    RuntimeState.StoryTime.Time = getRandomInt(
      RuntimeState.StorySettings.TimeMin,
      RuntimeState.StorySettings.TimeMax
    );
    SaveDatabase();
  }
}
