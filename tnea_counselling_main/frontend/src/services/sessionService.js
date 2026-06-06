import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'tnea_anonymous_session_id';
const RECOVERY_ID_KEY = 'tnea_recovery_id';
const PREFERENCES_KEY = 'tnea_user_preferences';
const JOURNEY_KEY = 'tnea_user_journey';

// Generate a human readable recovery ID like TN-4827-AB91
const generateRecoveryId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, O, 1, I for clarity
  let id = 'TN-';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  id += '-';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const sessionService = {
  /**
   * Gets the existing session ID from localStorage or creates a new one.
   * Also ensures a Recovery ID is generated.
   */
  async getOrCreateSession() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    let recoveryId = localStorage.getItem(RECOVERY_ID_KEY);

    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem(SESSION_KEY, sessionId);
      
      if (!recoveryId) {
        recoveryId = generateRecoveryId();
        localStorage.setItem(RECOVERY_ID_KEY, recoveryId);
      }
      
      console.log("Created anonymous session:", sessionId, "Recovery ID:", recoveryId);
    }

    return { sessionId, recoveryId };
  },

  /**
   * Get the current Recovery ID
   */
  getRecoveryId() {
    return localStorage.getItem(RECOVERY_ID_KEY);
  },

  /**
   * Save user preferences (academic standard, expected cutoff, etc.) locally
   */
  async updatePreferences(preferences) {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    const existingPrefs = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    const newPrefs = { ...existingPrefs, ...preferences, updated_at: new Date().toISOString() };
    
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPrefs));
    return newPrefs;
  },

  /**
   * Get user preferences locally
   */
  getPreferences() {
    return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
  },

  /**
   * Track viewed colleges or courses locally
   */
  async trackInteraction(itemType, itemId) {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return;

    const journey = JSON.parse(localStorage.getItem(JOURNEY_KEY) || '{"viewed_colleges": [], "viewed_courses": []}');
    
    if (itemType === 'college') {
      if (!journey.viewed_colleges.includes(itemId)) {
        journey.viewed_colleges.push(itemId);
      }
    } else if (itemType === 'course') {
      if (!journey.viewed_courses.includes(itemId)) {
        journey.viewed_courses.push(itemId);
      }
    }

    journey.updated_at = new Date().toISOString();
    localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
  },
  
  /**
   * Get the user's educational journey locally
   */
  getJourney() {
    return JSON.parse(localStorage.getItem(JOURNEY_KEY) || '{"viewed_colleges": [], "viewed_courses": []}');
  }
};
