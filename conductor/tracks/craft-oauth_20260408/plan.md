# Implementation Plan: Craft.io OAuth Integration

## Phase 1: Configuration & Infrastructure
- [ ] Task: Update Environment Variables
    - [ ] Add `CRAFT_CLIENT_ID` and `CRAFT_CLIENT_SECRET` to `server/_core/env.ts`
    - [ ] Add `CRAFT_REDIRECT_URI` to `server/_core/env.ts`
    - [ ] Update `.env.example` with placeholders
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Configuration & Infrastructure' (Protocol in workflow.md)

## Phase 2: Backend Logic & Service Layer
- [ ] Task: Enhance `CraftAPIClient`
    - [ ] Implement `storage` logic within the client or as a helper to read/write `craftCredentials`
    - [ ] Add logic to auto-refresh tokens if `isTokenExpired()` is true during any request
- [ ] Task: Create `externalRouter` in tRPC
    - [ ] Add `getAuthUrl` procedure (protected)
    - [ ] Add `getConnectionStatus` procedure (protected)
    - [ ] Add `disconnect` procedure (protected)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Backend Logic & Service Layer' (Protocol in workflow.md)

## Phase 3: OAuth Callback & Token Exchange
- [ ] Task: Implement Callback Endpoint
    - [ ] Create a new Express route (non-tRPC) for `/api/auth/craft/callback`
    - [ ] Handle error states (user denied access, invalid state)
    - [ ] Logic to exchange code for token and save to database
    - [ ] Logic to initialize the root "ibl1nk" collection
- [ ] Task: Conductor - User Manual Verification 'Phase 3: OAuth Callback & Token Exchange' (Protocol in workflow.md)

## Phase 4: Frontend Integration (Settings Page)
- [ ] Task: Implement Settings UI
    - [ ] Update `client/src/pages/Settings.tsx` to include a "Craft.io Integration" section
    - [ ] Show "Connect" button if not connected
    - [ ] Show "Disconnect" and status if connected
- [ ] Task: Logic for OAuth Redirect
    - [ ] Handle the flow from clicking "Connect" to being redirected
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Frontend Integration' (Protocol in workflow.md)

## Phase 5: Testing & Security
- [ ] Task: Unit Tests for Token Exchange
    - [ ] Mock axios responses for token exchange and refresh
    - [ ] Verify database inserts/updates happen correctly
- [ ] Task: IDOR Validation
    - [ ] Verify that a user cannot access or refresh another user's Craft tokens
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Testing & Security' (Protocol in workflow.md)
