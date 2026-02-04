export interface ScoreData {
  highScore: number;
  bestCombo: number;
}

const STORAGE_PREFIX = "midi-jam-score-";

/**
 * Abstraction for score storage. 
 * Uses localStorage for now, but provides an async interface for future server integration.
 */
export const scoreStorage = {
  async getScore(midiId: string): Promise<ScoreData> {
    if (typeof window === "undefined") return { highScore: 0, bestCombo: 0 };
    
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${midiId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          highScore: parsed.highScore || 0,
          bestCombo: parsed.bestCombo || 0,
        };
      }
    } catch (e) {
      console.error("Failed to load score from storage:", e);
    }
    
    return { highScore: 0, bestCombo: 0 };
  },

  async saveScore(midiId: string, data: ScoreData): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${midiId}`, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save score to storage:", e);
    }
  },
};
