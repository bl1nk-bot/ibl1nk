# Track Specification: craft-oauth-integration

## Overview
Implement the OAuth 2.0 authentication flow for Craft.io to enable bidirectional synchronization between the ibl1nk Dashboard and Craft Collections/Documents.

## Functional Requirements
- **OAuth Initiation:**
    - Generate authorization URL with required scopes (`collections:read`, `collections:write`, `documents:read`, `documents:write`).
    - Provide a "Connect Craft" button in the Settings page.
- **Callback Handling:**
    - Implement a server-side endpoint to handle the redirect from Craft.
    - Exchange the authorization code for access and refresh tokens.
- **Token Persistence:**
    - Store access and refresh tokens in the `craftCredentials` table.
    - Scoping must be strictly enforced via `userId`.
- **Post-Connection Initialization:**
    - Automatically fetch or create a root "ibl1nk" collection in the user's Craft account.
    - Update the connection status UI in the Settings page.
- **Token Management:**
    - Logic to check for token expiration.
    - Automatic token refresh during API calls.

## Technical Standards
- **Standardized Error Handling:** Use `TRPCError` for all authentication failures with Thai/English messages.
- **IDOR Protection:** Ensure users can only manage their own Craft credentials.
- **Absolute Imports:** Use `@/` for all internal module references.

## Acceptance Criteria
- [ ] User can click "Connect Craft" and be redirected to Craft.io.
- [ ] After approval, user is redirected back to the Settings page.
- [ ] Craft connection status shows "Connected" with the account name/email (if available).
- [ ] A root "ibl1nk" collection is visible in the user's Craft account.
- [ ] Refresh token logic works when access token is manually expired for testing.

## Out of Scope
- Full bidirectional sync of outlines/scenes (will be handled in a subsequent track).
- Syncing Obsidian content to Craft.
