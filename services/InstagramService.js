export class InstagramService {
  static getCSRF() {
    return document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k === "csrftoken") acc = decodeURIComponent(v);
      return acc;
    }, null);
  }

  static getUserId() {
    return document.cookie.split(";").reduce((acc, c) => {
      const [k, v] = c.trim().split("=");
      if (k === "ds_user_id") acc = v;
      return acc;
    }, null);
  }

  static extractUsernameFromDOM() {
    // Minimal example: find first anchor with href starting with '/'
    const anchors = document.querySelectorAll("a[href='/']");
    for (let a of anchors) {
      const href = a?.parentNode?.parentNode?.parentNode?.children[0]?.children[2]?.children[0]?.children[4]?.children[1]?.children[1]?.children[0]?.getAttribute("href");
      if (href) return href.split("/").join("");
    }
    return null;
  }
}
