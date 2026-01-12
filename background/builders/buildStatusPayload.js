import { RuntimeState } from "../state/runtimeState";

export function buildStatusPayload() {
  return {
    CurrentUser: RuntimeState.CurrentUser,

    pools: {
      users: RuntimeState.UserPool.length,
      followed: RuntimeState.FollowedPool.length,
      unfollowed: RuntimeState.UnfollowedPool.length,
    },

    settings: RuntimeState.settings,
    timers: RuntimeState.timers,

    platforms: {
      instagram: instagram_data,
      tiktok: tiktok_data,
      facebook: facebook_data,
    },
  };
}
