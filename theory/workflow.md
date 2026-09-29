# Theory: Workflow (Login to JWT)

```
User          Client (React)            Server                    DB
 |  enter creds   |                        |                        |
 |--------------->| 1. POST /login         |                        |
 |                |----------------------->| 2. look up user        |
 |                |                        |----------------------->|
 |                |                        |<-----------------------|
 |                |                        | 3. compare password    |
 |                |                        |    hash                |
 |                |                        | 4. build payload       |
 |                |                        |    {userId, role, exp} |
 |                |                        | 5. sign with secret    |
 |                |<-----------------------| 6. return JWT          |
 |                | 7. store token         |                        |
 |                | 8. GET /dashboard      |                        |
 |                |   Authorization:       |                        |
 |                |   Bearer <JWT>         |                        |
 |                |----------------------->| 9. verify signature    |
 |                |                        |    + expiry            |
 |<---------------|<-----------------------| 10. return data        |
```

## Basic steps

1. **User submits credentials.** The user types a username and password and clicks Login.
2. **Client sends them to the server** over HTTPS (`POST /login`).
3. **Server verifies the credentials.** It finds the user and compares the password against the stored hash (for example bcrypt).
4. **Server creates the payload.** Claims such as `userId`, `role`, `iat` (issued at) and `exp` (expiry).
5. **Server signs the token.** Header and payload are Base64URL-encoded and signed with the secret key, producing `header.payload.signature`.
6. **Server returns the JWT** to the client. If credentials are wrong, it returns 401 and no token.
7. **Client stores the token**, typically in memory, `localStorage`, or an HttpOnly cookie.
8. **Client sends the token** in the `Authorization: Bearer <token>` header on each protected request.
9. **Server verifies the token**: recompute the signature, compare it, and check that `exp` has not passed.
10. **Access is granted or denied.** Valid: return data using the role from the payload. Invalid or expired: return 401 and the client sends the user back to login.

## Storage trade-offs

| Location | Pros | Cons |
|----------|------|------|
| localStorage | Simple, survives refresh | Readable by JavaScript, so exposed to XSS |
| HttpOnly cookie | Not readable by JavaScript | Needs CSRF protection |
| In memory | Safest from XSS | Lost on refresh |

## Security notes
Always use HTTPS, set short expiry times, use refresh tokens for long sessions, never store sensitive data in the payload, and always verify on the server.
