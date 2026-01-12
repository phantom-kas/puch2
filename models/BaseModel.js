// models/BaseModel.js
export class BaseModel {
    constructor() {
        this.UserPool = [];
        this.LikedMedia = [];
        this.FollowedPool = [];
    }

    save() {
        console.warn("Save not implemented in BaseModel");
    }

    load() {
        console.warn("Load not implemented in BaseModel");
    }
}
