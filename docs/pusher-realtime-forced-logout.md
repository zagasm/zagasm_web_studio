# Realtime Forced Logout With Pusher

## Purpose

Frontend can receive a realtime logout event when the same user logs in on another device and the backend revokes the older session.

Use this to log the old device out immediately instead of waiting for polling or a later `401`.

## Backend Contract

### Realtime Channel

Subscribe to:

```text
private-user.{currentUserId}
```

Example:

```text
private-user.77b6d542-94a2-47cd-aef9-097e643fe762
```

### Event Name

Listen for:

```text
session.revoked
```

### Event Payload

Backend sends:

```json
{
  "type": "session_revoked",
  "reason": "another_device",
  "message": "You have been logged out because you have logged in on another device.",
  "user_id": "77b6d542-94a2-47cd-aef9-097e643fe762",
  "revoked_token_id": "old-token-id",
  "new_token_id": "new-token-id",
  "revoked_at": "2026-04-14T12:34:56Z"
}
```

Frontend should treat these fields as required for UX:

- `reason`
- `message`
- `user_id`

## Private Channel Auth Endpoint

Use:

```text
POST /api/v1/realtime/pusher/auth
```

Send the current bearer token.

Request body should include:

```json
{
  "channel_name": "private-user.{currentUserId}",
  "socket_id": "pusher-socket-id"
}
```

Rules:

- authenticated user can only subscribe to `private-user.{their_own_user_id}`
- any other user channel is rejected
- anonymous requests are rejected

## Recommended Frontend Flow

### 1. After login, signup, google login, or password reset

Once frontend has:

- authenticated user
- bearer token

it should connect the realtime client and subscribe to:

```text
private-user.{currentUserId}
```

### 2. Use bearer auth for private channel authorization

The realtime auth request should send:

```http
Authorization: Bearer {token}
```

### 3. Listen for `session.revoked`

When received:

1. clear auth token
2. clear cached user/auth state
3. disconnect realtime connection
4. redirect to `/auth/signin`
5. show this exact message:

```text
You have been logged out because you have logged in on another device.
```

### 4. Keep existing fallbacks

Frontend should still keep:

- `401` interception
- polling fallback if already implemented

Realtime should now be the primary path. Polling remains the fallback.

## Auth Flows That Can Trigger This

Older sessions can now be revoked during:

- normal login: `POST /api/v1/login`
- Google login: `POST /api/v1/google/login`
- password reset auto-login: `POST /api/v1/password/reset`

These flows rotate tokens and can trigger `session.revoked` for older devices.

## Example Pusher Client Shape

Frontend should configure the client with:

- broadcaster credentials
- auth endpoint: `/api/v1/realtime/pusher/auth`
- bearer token in auth headers

Example auth config shape:

```js
authEndpoint: `${API_URL}/api/v1/realtime/pusher/auth`,
auth: {
  headers: {
    Authorization: `Bearer ${token}`,
  },
},
```

Then subscribe to:

```js
`private-user.${currentUserId}`
```

And listen for:

```js
"session.revoked"
```

## Logout Handling Notes

- Do not ignore the event just because the app still has local state.
- The event means the current device session is no longer valid.
- Frontend should not wait for the next API failure before logging out.

## Environment Variables

Frontend expects:

```text
VITE_PUSHER_KEY=
VITE_PUSHER_CLUSTER=
VITE_API_URL=
```

## Testing Checklist

1. Log in as user A on device 1.
2. Confirm device 1 subscribes to `private-user.{user_id}`.
3. Log in as user A on device 2.
4. Confirm device 1 receives `session.revoked`.
5. Confirm device 1 immediately logs out and shows the forced logout message.
6. Confirm device 2 stays signed in.
7. Repeat the same check for Google login.
8. Repeat the same check for password reset auto-login.
