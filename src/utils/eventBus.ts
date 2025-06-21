type EventCallback = (...args: unknown[]) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
  }

  emit(event: string, ...args: unknown[]): void {
    if (!this.events[event]) return;

    this.events[event].forEach(callback => callback(...args));
  }
}

export const eventBus = new EventBus();

// Eventos específicos
export const EVENTS = {
  LEVEL_UP: 'level_up',
  BADGE_UNLOCKED: 'badge_unlocked',
  MISSION_COMPLETED: 'mission_completed',
  USER_STATS_UPDATED: 'user_stats_updated',
  AVATAR_CHANGED: 'avatar_changed',
} as const; 
