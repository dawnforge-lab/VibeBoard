/**
 * StorageAdapter
 * Abstract interface for cross-platform storage
 */

export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * LocalStorageAdapter - Web implementation
 */
export class LocalStorageAdapter implements IStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }
}

/**
 * Factory function for dependency injection
 */
export function createStorageAdapter(
  platform: 'web' | 'mobile' = 'web'
): IStorage {
  if (platform === 'web') {
    return new LocalStorageAdapter();
  }

  // For mobile, we'd use AsyncStorage (to be implemented when needed)
  throw new Error('Mobile storage not yet implemented');
}
