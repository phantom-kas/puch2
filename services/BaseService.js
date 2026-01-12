// services/BaseService.js
export class BaseService {
    constructor() {
        this.hoursLeft = 24;
        this.savedDM = {};
    }

    addUsers(users) {
        console.warn("addUsers not implemented in BaseService");
    }

    saveDatabase() {
        console.warn("saveDatabase not implemented in BaseService");
    }
}
