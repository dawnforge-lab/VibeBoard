# App Configuration Reference

This document lists all available configuration keys that can be managed through the Admin Panel.

## Usage

### Client-Side

```typescript
import { useAppConfig, useConfigValue } from '@/lib/hooks/useAppConfig';

// Get all config
const { config, isLoading, isError, refresh, isFallback } = useAppConfig();

// Get a single config value
const maxLength = useConfigValue('max_input_length');
```

### Server-Side

```typescript
import { getPublicConfigs } from '@/lib/admin/config';

const configs = await getPublicConfigs();
const maxLength = configs.max_input_length || 200; // with fallback
```

## Configuration Keys

### General Settings

| Key                       | Type    | Default | Description                                                 |
| ------------------------- | ------- | ------- | ----------------------------------------------------------- |
| `max_input_length`        | number  | 200     | Maximum number of characters allowed in text input field    |
| `maintenance_mode`        | boolean | false   | When true, app displays maintenance page to non-admin users |
| `session_timeout_minutes` | number  | 30      | User session timeout in minutes (idle time)                 |

### Style Management

| Key                 | Type   | Default | Description                                   |
| ------------------- | ------ | ------- | --------------------------------------------- |
| `free_styles_limit` | number | 10      | Maximum number of saved styles for free users |
| `pro_styles_limit`  | number | 50      | Maximum number of saved styles for Pro users  |
| `max_custom_styles` | number | 5       | Maximum custom styles a user can create       |

### Monetization

| Key                             | Type    | Default | Description                                               |
| ------------------------------- | ------- | ------- | --------------------------------------------------------- |
| `pro_monthly_price_usd`         | number  | 2.99    | Monthly subscription price in USD                         |
| `pro_annual_price_usd`          | number  | 24.99   | Annual subscription price in USD                          |
| `show_ads`                      | boolean | true    | Whether to display ads to free users                      |
| `enable_pack_purchases`         | boolean | true    | Enable/disable font pack purchases                        |
| `max_pack_price_usd`            | number  | 9.99    | Maximum price for a single font pack                      |
| `community_pack_commission_pct` | number  | 30      | Commission percentage for community-created packs (0-100) |

### AI Features

| Key                         | Type    | Default | Description                                        |
| --------------------------- | ------- | ------- | -------------------------------------------------- |
| `enable_ai_suggestions`     | boolean | true    | Enable/disable AI-powered text suggestions feature |
| `ai_suggestions_limit_free` | number  | 3       | Daily AI suggestion limit for free users           |
| `ai_suggestions_limit_pro`  | number  | 50      | Daily AI suggestion limit for Pro users            |

### Community Features

| Key                      | Type    | Default | Description                                   |
| ------------------------ | ------- | ------- | --------------------------------------------- |
| `enable_community_packs` | boolean | true    | Enable/disable community-submitted font packs |

### Performance & Security

| Key                              | Type   | Default | Description                                   |
| -------------------------------- | ------ | ------- | --------------------------------------------- |
| `rate_limit_requests_per_minute` | number | 100     | API rate limit per user (requests per minute) |

## Fallback Behavior

The `useAppConfig` hook implements a robust fallback strategy:

1. **Primary**: Fetches config from `/api/config` endpoint
2. **Cache**: Uses SWR cache if available (60s TTL)
3. **Fallback**: Uses hardcoded defaults if API fails

### Example with Fallback

```typescript
const { config, isFallback } = useAppConfig();

if (isFallback) {
  console.warn('Using fallback config due to API error');
}

const maxLength = config.max_input_length; // Always returns a value
```

## Updating Configuration

Configuration can only be updated through the Admin Panel:

1. Navigate to `/admin/config`
2. Find the configuration key
3. Edit the value
4. Save changes

Changes propagate to clients within 60 seconds (cache TTL).

## Adding New Config Keys

To add a new configuration key:

1. **Add to Default Config** in `lib/hooks/useAppConfig.ts`:

```typescript
const DEFAULT_CONFIG = {
  // ... existing keys
  your_new_key: 'default_value',
} as const;
```

2. **Seed Database** with initial value:

```sql
INSERT INTO app_config (key, value, category, description)
VALUES ('your_new_key', '"default_value"', 'general', 'Description here');
```

3. **Document here** in the appropriate category section above

4. **Use in code**:

```typescript
const value = useConfigValue('your_new_key');
```

## Performance Considerations

- **Client-side caching**: Configs are cached for 60 seconds
- **Server-side caching**: API route uses `s-maxage=60` with `stale-while-revalidate=30`
- **Deduplication**: Multiple simultaneous requests are deduplicated
- **Background refresh**: SWR automatically refreshes in background

## Testing Config Updates

To verify config changes propagate correctly:

1. Open app in browser
2. Note current config value
3. Update value in Admin Panel
4. Wait up to 60 seconds
5. Verify new value appears (or manually call `refresh()`)

```typescript
const { config, refresh } = useAppConfig();

// Force immediate refresh
await refresh();
```

## Error Handling

The hook never throws errors. Instead, it:

- Returns default config if API fails
- Sets `isError: true` flag
- Provides error details in `error` property
- Retries automatically (3 attempts with exponential backoff)

```typescript
const { config, isError, error } = useAppConfig();

if (isError) {
  console.error('Config fetch error:', error);
  // App continues working with defaults
}
```

## Security Notes

- Only configs marked with `is_public: true` are exposed via `/api/config`
- Sensitive configs (API keys, secrets) are never sent to clients
- Admin-only configs require authentication to access
- All config changes are logged in the audit trail
