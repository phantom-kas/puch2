document.addEventListener("DOMContentLoaded", () => {
  // Get user from background
  chrome.runtime.sendMessage({ action: "getUser" }, (user) => {
    console.log("Current User:", user);
    if (user) {
      document.getElementById("username").textContent = user.username;
    }
  });

  document.getElementById("saveUserBtn").addEventListener("click", () => {
    const username = document.getElementById("usernameInput").value;
    chrome.runtime.sendMessage(
      { action: "saveUser", data: { username } },
      (res) => console.log("Saved?", res.success)
    );
  });

  document.getElementById("openTiktok").addEventListener("click", () => {
    chrome.runtime.sendMessage(
      { action: "openTab", url: "https://www.tiktok.com/" },
      (res) => console.log(res.success)
    );
  });
});