import { supabase } from '../supabase';

export type AnalyticsEvent = {
  event_name: string;
  event_data?: Record<string, unknown>;
};

// Buffer for batching events
let eventBuffer: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

const FLUSH_INTERVAL = 5000; // 5 seconds
const MAX_BUFFER_SIZE = 50;

export async function trackEvent(
  eventName: string,
  eventData?: Record<string, unknown>
) {
  const event: AnalyticsEvent = {
    event_name: eventName,
    event_data: eventData || {},
  };

  eventBuffer.push(event);

  // Flush if buffer is full
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    await flushEvents();
    return;
  }

  // Schedule flush if not already scheduled
  if (!flushTimeout) {
    flushTimeout = setTimeout(async () => {
      await flushEvents();
    }, FLUSH_INTERVAL);
  }
}

export async function flushEvents() {
  if (eventBuffer.length === 0) {
    return;
  }

  const eventsToSend = [...eventBuffer];
  eventBuffer = [];

  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const records = eventsToSend.map((event) => ({
      user_id: user?.id || null,
      event_name: event.event_name,
      event_data: event.event_data || {},
    }));

    const { error } = await supabase.from('analytics').insert(records);

    if (error) {
      console.error('Error sending analytics events:', error);
      // Re-add events to buffer for retry
      eventBuffer = [...eventsToSend, ...eventBuffer];
    }
  } catch (error) {
    console.error('Failed to flush analytics events:', error);
    // Re-add events to buffer for retry
    eventBuffer = [...eventsToSend, ...eventBuffer];
  }
}

// Common events
export const AnalyticsEvents = {
  // Style events
  STYLE_COPIED: 'style_copied',
  STYLE_SHARED: 'style_shared',
  STYLE_FAVORITED: 'style_favorited',
  STYLE_UNFAVORITED: 'style_unfavorited',

  // Pack events
  PACK_SWITCHED: 'pack_switched',
  PACK_VIEWED: 'pack_viewed',

  // User events
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',

  // App events
  APP_OPENED: 'app_opened',
  APP_CLOSED: 'app_closed',
  TEXT_INPUTTED: 'text_inputted',
};

// Flush events when page is about to unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    void flushEvents();
  });
}
