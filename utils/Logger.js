// utils/Logger.js
export const Logger = {
    log: (...args) => console.log("[EXT]", ...args),
    warn: (...args) => console.warn("[EXT]", ...args),
    error: (...args) => console.error("[EXT]", ...args),
};
