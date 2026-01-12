import { StorageService } from "./StorageService.js";
import { RuntimeState } from "../models/RuntimeState.js";
export class DatabaseService {
  static async import(jsonString, currentUser) {
    const cloudDb = JSON.parse(jsonString);
    const content = cloudDb.Content || [];
    const userEntry = content.find(
      (e) => currentUser && e?.user_id === currentUser.user_id
    );
    if (!userEntry || !userEntry.database) return;
    const local = await StorageService.load("InstaBaitDatabase");
    const localDb = local.InstaBaitDatabase || [];
    const database = userEntry.database;
    RuntimeState.hydrate(database);

    await DatabaseService.save();
  }

  static async load() {
    const db = await StorageService.load("InstaBaitDatabase");
    RuntimeState.hydrate(db?.InstaBaitDatabase || {});
  }

  static async save() {
    await StorageService.save({
      InstaBaitDatabase: RuntimeState.serialize(),
    });
  }


  
}
