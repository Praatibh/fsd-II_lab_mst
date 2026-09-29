# Practical: Workflow

## A. Login flow

```
LoginForm                 AuthContext.login()           jwt.js                localStorage
   | submit(user, pass)          |                         |                       |
   |---------------------------->| find user in DEMO_USERS |                       |
   |                             | match?  -- no --> error "Invalid username or password"
   |                             |--yes--> createToken({userId, role}) ->|         |
   |                             |<---------- header.payload.signature --|         |
   |                             | setItem("auth_token", token) ------------------>|
   |                             | setUser(decoded payload)                        |
   |<-- re-render: user set -----|                                                 |
App shows <Dashboard/>  (role badge + userId + token details)
```

## B. Page refresh flow (session restore)

1. `AuthProvider` mounts and reads `auth_token` from localStorage.
2. `verifyToken(token)` checks the signature and the `exp` claim.
3. Valid: `user` is set and the Dashboard shows without logging in again.
4. Invalid or expired: token is removed and the Login form shows.

## C. Logout flow

Click Logout -> remove `auth_token` -> `user = null` -> App renders LoginForm again.

## D. Step checklist mapped to the requirements

| Requirement | Where it happens |
|-------------|------------------|
| Username and password fields | `LoginForm.jsx` |
| Login button | `LoginForm.jsx` |
| Create simulated JWT with userId and role | `createToken()` in `jwt.js` |
| Store the token | `localStorage.setItem` in `AuthContext.jsx` |
| Display role after login | Role badge in `Dashboard.jsx` |
| Dashboard only when logged in | Conditional render in `App.jsx` |
