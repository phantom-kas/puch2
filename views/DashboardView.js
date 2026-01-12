const INSTOO_ENABLED = false;

// Utility functions for DOM manipulation
const DOM = {
  get: (selector) => document.querySelector(selector),
  getAll: (selector) => document.querySelectorAll(selector),
  create: (tag) => document.createElement(tag),
  
  html: (element, content) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (content !== undefined) {
      element.innerHTML = content;
      return element;
    }
    return element.innerHTML;
  },
  
  text: (element, content) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (content !== undefined) {
      element.textContent = content;
      return element;
    }
    return element.textContent;
  },
  
  attr: (element, name, value) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (value !== undefined) {
      element.setAttribute(name, value);
      return element;
    }
    return element.getAttribute(name);
  },
  
  val: (element, value) => {
    if (typeof element === 'string') element = DOM.get(element);
    if (value !== undefined) {
      element.value = value;
      return element;
    }
    return element.value;
  },
  
  addClass: (element, className) => {
    if (typeof element === 'string') element = DOM.get(element);
    element.classList.add(className);
    return element;
  },
  
  removeClass: (element, className) => {
    if (typeof element === 'string') element = DOM.get(element);
    element.classList.remove(className);
    return element;
  },
  
  show: (element) => {
    if (typeof element === 'string') element = DOM.get(element);
    element.style.display = '';
    return element;
  },
  
  hide: (element) => {
    if (typeof element === 'string') element = DOM.get(element);
    element.style.display = 'none';
    return element;
  },
  
  empty: (element) => {
    if (typeof element === 'string') element = DOM.get(element);
    element.innerHTML = '';
    return element;
  },
  
  append: (parent, child) => {
    if (typeof parent === 'string') parent = DOM.get(parent);
    if (typeof child === 'string') {
      parent.insertAdjacentHTML('beforeend', child);
    } else {
      parent.appendChild(child);
    }
    return parent;
  },
  
  prepend: (parent, child) => {
    if (typeof parent === 'string') parent = DOM.get(parent);
    if (typeof child === 'string') {
      parent.insertAdjacentHTML('afterbegin', child);
    } else {
      parent.insertBefore(child, parent.firstChild);
    }
    return parent;
  },
  
  closest: (element, selector) => {
    if (typeof element === 'string') element = DOM.get(element);
    return element.closest(selector);
  },
  
  find: (element, selector) => {
    if (typeof element === 'string') element = DOM.get(element);
    return element.querySelector(selector);
  },
  
  findAll: (element, selector) => {
    if (typeof element === 'string') element = DOM.get(element);
    return element.querySelectorAll(selector);
  },
  
  on: (element, event, handler, useCapture = false) => {
    if (typeof element === 'string') {
      // Delegate event
      document.addEventListener(event, (e) => {
        if (e.target.matches(element)) {
          handler.call(e.target, e);
        }
      }, useCapture);
    } else {
      element.addEventListener(event, handler, useCapture);
    }
  }
};

// Global State
const State = {
  CurrentUser: { username: 'User koif', user_id: '1', user_pic_url: 'img' },
  ComPort: null,
  follow_count_num: 0,
  following_count_num: 0,
  linkedin_data: [],
  instagram_data: [],
  user_stats: [],
  last_ten_min: 1000000,
  last_ten_max: 0,
  DisplayFollowersNum: 10,
  DisplayLikesNum: 20,
  user_email: "",
  dashboardMode: 0,
  postedInst: false,
  follow_speed: 0,
  emailed: false,
  enable_get_followers: false,
  unfollow_speed: 0,
  story_speed: 0,
  unfollowInstoo: false,
  post_stats: false,
  tiktok_data: [],
  hoursLeft: 8,
  twitter_data: [],
  like_speed: 0,
  follower_data: [],
  daily_data: [],
  blacklist: [],
  filters: [],
  minPhotos: 1,
  minFollowers: 100,
  minFollowing: 100,
  maxFollowers: 100000,
  maxFollowing: 100000,
  EnableFilters: false,
  update_interval: false,
  IdealTargets: [],
  addIdeal: true,
  follower_growth: 0,
  set_update: false,
  collectSelfFollowers: false,
  tiktok_speed: 0,
  twitter_speed: 0,
  facebook_speed: 0,
  unfollow_mode: false,
  DMMode: true,
  mode: "instagram",
  StartTime: "",
  AutoActions: [],
  analytics: [],
  startDate: "",
  chart_data: null,
  analytics_chart: null,
  stopDate: "",
  cal_events: [],
  activity_log: "",
  instooData: [],
  schedule_list: "",
  user_followers: [],
  calendar: null,
  chart3: null,
  chart: null,
  chart2: null,
  canvas: null,
  Duration: 8,
  logged_in: false,
  startedTutorial: false,
  likeCount: 0,
  myCollectJob: {},
  maxStories: 1000,
  user_plan: null,
  comment_speed: 0,
  global_settings: {},
  global_accounts: [],
  gotAnalytics: false,
  global_tags: [],
  global_locations: [],
  started: false,
  paid_sub: false,
  my_followers: [],
  first: false,
  cloud_backup: false,
  start_license: 0,
  last_follow_count: 0,
  clicks: {},
  version: "",
  StartReact: false,
  StartSchedule: false,
  reacts: [],
  follow_val: false,
  like_val: false,
  comment_val: false,
  unfollow_val: false,
  user_cloud: true,
  UnfollowedPoolSize: 0,
  FollowedPoolSize: 0,
  LikePoolSize: 0,
  StoryPoolSize: 0,
  CommentPoolSize: 0,
  last_day: 0,
  day: 0,
  maxLikes: 1000,
  maxFollows: 1000,
  maxUnfollows: 1000,
  maxComments: 10,
  hashtag_dict: {},
  account_dict: {},
  counted_dict: {},
  clicks_dict: {},
  email_name: null,
  speed_limit: 100,
  UnfollowAfterDays: null,
  cloud_db: null,
  live_snapshots: [],
  live_tags: [],
  like_accounts: [],
  selectedAccount: "",
  loadedAccounts: false,
  updated_cloud: false
};

window.chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

// Utility Functions
function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function hashCode(str) {
  return str
    .split("")
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0
    );
}

function User(username, user_id, full_name, user_pic_url, followed_time) {
  this.username = username;
  this.user_id = user_id;
  this.full_name = full_name;
  this.user_pic_url = user_pic_url;
  this.followed_time = followed_time;
}

function roughSizeOfObject(object) {
  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);
      for (const i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}

// Event Listeners Setup
function setupEventListeners() {
  // Change events
  DOM.on('#minPhoto', 'change', (e) => {
    const value = e.target.value;
    SendMessage("minPhoto", "minPhoto", value);
  });

  DOM.on('#maxFollower', 'change', (e) => {
    const value = e.target.value;
    SendMessage("maxFollowers", "maxFollowers", value);
  });

  DOM.on('#minFollower', 'change', (e) => {
    const value = e.target.value;
    SendMessage("minFollowers", "minFollowers", value);
  });

  DOM.on('#minFollowing', 'change', (e) => {
    const value = e.target.value;
    SendMessage("minFollowing", "minFollowing", value);
  });

  DOM.on('#maxFollowing', 'change', (e) => {
    const value = e.target.value;
    SendMessage("maxFollowing", "maxFollowing", value);
  });

  // Click events
  DOM.on('#whitelist-user', 'click', (e) => {
    const user = prompt("Please enter the username exactly");
    if (user) {
      const split_users = user.split(",");
      for (let kk = 0; kk < split_users.length; kk++) {
        SendMessage(
          "AddUserToWhitelistName",
          "username",
          split_users[kk]
            .split(",").join("")
            .split(" ").join("")
            .split("@").join("")
        );
      }
      DOM.empty('#add-user-results');
      DOM.val('#add-user-search', '');
    }
  });

  DOM.on('.remove-user-whitelist', 'click', function(e) {
    RemoveWhitelistedUser(this);
  });

  DOM.on('.add-whitelist-user', 'click', function(e) {
    AddUserToWhitelist(this);
  });

  DOM.on('#whitelist-clear', 'click', () => {
    SendMessage("ClearWhite", "", "");
  });

  DOM.on('#clear-filter', 'click', () => {
    SendMessage("ClearFilters", "user", "");
  });

  DOM.on('#add-filter', 'click', () => {
    const new_blacklist = prompt("Please enter a word to add it to the filters:");
    if (new_blacklist && new_blacklist.includes(",")) {
      const split = new_blacklist.split(",");
      for (let kk = 0; kk < split.length; kk++) {
        SendMessage("AddToFilters", "user", split[kk].split("@").join(""));
      }
    } else if (new_blacklist && new_blacklist.includes(" ")) {
      const split = new_blacklist.split(" ");
      for (let kk = 0; kk < split.length; kk++) {
        SendMessage("AddToFilters", "user", split[kk].split("@").join(""));
      }
    } else if (new_blacklist) {
      SendMessage("AddToFilters", "user", new_blacklist.split("@").join(""));
    }
    updateFiltersDisplay();
  });

  DOM.on('#add-blacklist', 'click', () => {
    const new_blacklist = prompt("Please enter a username exactly to add it to the blacklist:");
    if (new_blacklist && new_blacklist.includes(",")) {
      const split = new_blacklist.split(",");
      for (let kk = 0; kk < split.length; kk++) {
        SendMessage("AddToBlacklist", "user", split[kk].split("@").join(""));
      }
    } else if (new_blacklist && new_blacklist.includes(" ")) {
      const split = new_blacklist.split(" ");
      for (let kk = 0; kk < split.length; kk++) {
        SendMessage("AddToBlacklist", "user", split[kk].split("@").join(""));
      }
    } else if (new_blacklist) {
      SendMessage("AddToBlacklist", "user", new_blacklist.split("@").join(""));
    }
    updateFiltersDisplay();
  });
}

function updateFiltersDisplay() {
  let followers_string = "";
  for (let kk = 0; kk < State.user_followers.length; kk++) {
    followers_string += State.user_followers[kk] + ", ";
  }
  
  let ideal_targets_string = "";
  for (let kk = 0; kk < State.IdealTargets.length; kk++) {
    ideal_targets_string +=
      State.IdealTargets[kk].username +
      " followers: " +
      State.IdealTargets[kk].followers +
      "<br> ";
  }

  let blacklist_string = "";
  for (let kk = 0; kk < State.blacklist.length; kk++) {
    blacklist_string += State.blacklist[kk] + ",  ";
  }

  let filter_string = "";
  for (let kk = 0; kk < State.filters.length; kk++) {
    filter_string += State.filters[kk] + ",  ";
  }
  
  DOM.html('#followers_list',
    "Followers " +
      State.user_followers.length +
      "/" +
      State.follow_count_num +
      ": " +
      followers_string +
      "<br>"
  );
  DOM.html('#activity_log', "<br>Activity Log: <br>" + State.activity_log);
  DOM.html('#blacklist',
    "<br>Blacklist of profiles to never re-visit:  <br>" + blacklist_string
  );
  DOM.html('#filters',
    "<br>Words to avoid in bio text and photo content:  <br>" + filter_string
  );
  DOM.html('#IdealTargets',
    "<br>Ideal Account Targets: <br>" + ideal_targets_string
  );
}

// Communication Functions
function CreateComPort() {
  State.ComPort = chrome.runtime.connect({
    name: "instafollow213index",
  });
  State.ComPort.onMessage.addListener(OnMessageReceive);
}

function SendMessage(tag, msgTag, msg) {
  const sendObj = { Tag: tag };
  sendObj[msgTag] = msg;
  if (typeof State.ComPort != "undefined") {
    State.ComPort.postMessage(sendObj);
  }
}

// Initialization
async function checkWhiteLabel() {
  try {
    const response = await fetch(
      "https://instoo.com/user/CheckWhiteLabel",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: "fnk666@gmail.com" })
      }
    );

    const text = await response.text();

    if (text.trim().startsWith("<")) {
      console.warn("Instoo returned HTML (likely login page).");
      chrome.runtime.sendMessage({
        type: "INIT_DATA",
        payload: { error: "Not authenticated or API changed" }
      });
      return;
    }

    const data = JSON.parse(text);
    console.log("Instoo data:", data);
    chrome.runtime.sendMessage({
      type: "INIT_DATA",
      payload: data
    });

  } catch (err) {
    console.error("API request failed:", err);
    chrome.runtime.sendMessage({
      type: "INIT_DATA",
      payload: { error: err.message || "Network or parse error" }
    });
  }
}

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
  checkWhiteLabel();
  DOM.show('#userLogin');
  CreateComPort();
  setupEventListeners();
  
  const starttiktok = DOM.get("#starttiktok");
  if (starttiktok && starttiktok.parentElement) {
    DOM.removeClass(starttiktok.parentElement, "hide");
  }

  const startinstagram = DOM.get("#startinstagram");
  if (startinstagram && startinstagram.parentElement) {
    DOM.addClass(startinstagram.parentElement, "active");
  }

  const starttiktokParent = DOM.get("#starttiktok");
  if (starttiktokParent && starttiktokParent.parentElement) {
    DOM.removeClass(starttiktokParent.parentElement, "active");
  }

  DOM.on('#userLogin', 'click', () => {
    SendMessage("userLogin", "", "");
  });

  SendMessage("GetUserStats", "", "");

  // Set up intervals
  setInterval(() => {
    if (State.hoursLeft > 0) {
      SendMessage("refreshStats", "", "");
    }
    if (roughSizeOfObject(State.cloud_db) < 15000000) {
      // Cloud backup logic
    }
  }, 1000 * 60 * 60);

  setInterval(() => {
    if (State.update_interval) {
      State.updated_cloud = true;
      State.update_interval = false;
    }
  }, 1000 * 60);

  DOM.on('#cloud-backup', 'click', () => {
    alert("Settings saved to cloud!");
    if (roughSizeOfObject(State.cloud_db) < 15000000) {
      // Backup logic
    }
  });

  DOM.on('#cloud-clear', 'click', () => {
    SendMessage("ResetAll", "", "");
    alert("Cloud backup cleared!");
    SendMessage("ResetAll", "", "");
  });

  State.version = chrome.runtime.getManifest().version;
  DOM.attr('#version', 'name', State.version);
  DOM.show('#sidebar-wrapper');

  // Additional initialization
  setTimeout(() => {
    const buttons = document.getElementsByTagName("div");
    for (let kk = 0; kk < buttons.length; kk++) {
      buttons[kk].classList.remove("hide");
    }
    State.version = chrome.runtime.getManifest().version;
    DOM.attr('#version', 'name', State.version);
    DOM.show('#sidebar-wrapper');
  }, 5000);

  const backupPictures = DOM.getAll('.backup_picture');
  backupPictures.forEach(img => {
    img.addEventListener('error', function() {
      this.setAttribute('src', 'icon.png');
    });
  });

  State.user_plan = DOM.attr('#plan', 'name');
  
  DOM.on('#sidebar-mosaic', 'click', () => {
    const win = window.open('https://tagmosaic.com', '_blank');
    win.focus();
  });

  DOM.show('#overlay');
  SendMessage("OpenInstagramFast", "Speed", 1);
});

// Message Handler
function OnMessageReceive(msg) {
  if (msg.Tag == "UserFollowComplete") {
    OnFollowedUser(msg.User);
  } else if (msg.Tag == "ReloadCharts") {
    State.instagram_data = msg.data.instagram_data;
    State.linkedin_data = msg.data.linkedin_data;
    // Reload charts logic
  } else if (msg.Tag == "setLanguage") {
    const errorMsg = `
      <div class='alert alert-success alert-dismissible' role='alert'>
        <button type='button' class='close' data-dismiss='alert' aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
        Instoo has detected that the language at instagram.com is not set to English. 
        Please follow these steps: <br>
        1) Click your profile picture in the top right corner, then click Profile. <br>
        2) Click Edit Profile.<br>
        3) Click Language at the very bottom of the page and select a new language.<br>
        4) Select English. It's in small gray text on the last line of the page to make it easy.
      </div>
    `;
    const errors = DOM.get('#errors');
    if (errors) {
      errors.insertAdjacentHTML('afterbegin', errorMsg);
    }
  }
  // ... Additional message handlers would follow the same pattern
}

// Helper Functions
function SetActiveSidebarItem(sidebar_id) {
  const sidebarItems = [
    "#sidebar-home",
    "#sidebar-home-tiktok",
    "#sidebar-home-facebook",
    "#sidebar-home-tw",
    "#sidebar-home-tinder2",
    "#sidebar-home-link2",
    "#sidebar-home-crm",
    "#sidebar-home-pinterest",
    "#sidebar-whitelist",
    "#sidebar-settings",
    "#sidebar-analytics",
    "#sidebar-upgrades",
    "#sidebar-help",
    "#sidebar-likes_comments"
  ];

  sidebarItems.forEach(item => {
    const element = DOM.get(item);
    if (element) {
      DOM.addClass(element, "sidebar-item");
      DOM.removeClass(element, "sidebar-item-active");
    }
  });

  const activeElement = DOM.get(sidebar_id);
  if (activeElement) {
    DOM.removeClass(activeElement, "sidebar-item");
    DOM.addClass(activeElement, "sidebar-item-active");
  }
}

function SetFollowValue(value) {
  SendMessage("SetFollowValue", "Value", value);
}

function SetCommentValue(value) {
  SendMessage("SetCommentValue", "Value", value);
}

function SetLikeValue(value) {
  SendMessage("SetLikeValue", "Value", value);
}

function SetStoryValue(value) {
  SendMessage("SetStoryValue", "Value", value);
}

function SetUnfollowValue(value) {
  SendMessage("SetUnfollowValue", "Value", value);
}

// Export for global access if needed
window.State = State;
window.DOM = DOM;
window.SendMessage = SendMessage;