/**
 * Analytics Models
 * Defines event tracking structure
 */

export type AnalyticsEventType =
  | 'style_copied'
  | 'style_shared'
  | 'style_favorited'
  | 'pack_switched'
  | 'app_opened'
  | 'purchase_completed';

export interface AnalyticsEvent {
  event: AnalyticsEventType;
  payload: {
    styleId?: string;
    packId?: string;
    textLength?: number;
    timestamp: string;
    sessionId?: string;
  };
}
