// Storage interface for the hotel management system
// Backend is handled by external Lambda APIs, so this is minimal

export interface IStorage {
  // Placeholder for future local storage needs
}

export class MemStorage implements IStorage {
  constructor() {
    // Backend handled by Lambda APIs
  }
}

export const storage = new MemStorage();
