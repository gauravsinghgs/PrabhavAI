import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@prabhav_user',
  SETTINGS: '@prabhav_settings',
  AUTH_TOKEN: '@prabhav_auth_token',
} as const;

export const StorageService = {
  // Generic methods
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },

  // Specific methods
  async getUser() {
    return this.getItem(STORAGE_KEYS.USER);
  },

  async setUser(user: object) {
    return this.setItem(STORAGE_KEYS.USER, user);
  },

  async getSettings() {
    return this.getItem(STORAGE_KEYS.SETTINGS);
  },

  async setSettings(settings: object) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving auth token:', error);
      throw error;
    }
  },

  async removeAuthToken(): Promise<void> {
    return this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};

export {STORAGE_KEYS};
