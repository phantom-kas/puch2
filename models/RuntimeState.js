export const RuntimeState = {
  UserPool: [],
  FollowedPool: [],
  LikedMedia: [],
  Settings: {},
  storySet: false,
  startedFollowLike: false,
  last_story:null, 

  hydrate(db) {
    this.UserPool = JSON.parse(db.UserPool || "[]");
    this.FollowedPool = JSON.parse(db.FollowedPool || "[]");
    this.Settings = JSON.parse(db.Settings || "{}");
    // ...
  },

  serialize() {
    return {
      UserPool: JSON.stringify(this.UserPool),
      FollowedPool: JSON.stringify(this.FollowedPool),
      Settings: JSON.stringify(this.Settings)
    };
  },

   addUser(user) {
    this.UserPool.push(user);
  }
};
