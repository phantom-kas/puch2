import { RuntimeState } from "../state/runtimeState";

export function buildLastStory(storyUser = "") {
  return {
    storyUser,
    username: RuntimeState.CurrentUser?.username,

    StartReact,
    reacts,
    CommentedMedia,
    maxComments,
    CommentPool,
    StartComment,
    recents,
    currentSpeed,
    backgroundDMs,
    EnableFilters,
    blacklist,
    filters,

    maxFollows,
    maxLikes,
    maxUnfollows,

    FollowPoolSize: FollowedPool.length,
    LikePoolSize: LikedMedia.length,
    UnfollowPoolSize: UnfollowedPool.length,
  };
}
