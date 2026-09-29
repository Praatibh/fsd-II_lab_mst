# Practical: Architecture

## Tech stack
React 18 + Vite. No backend: the "server" is simulated in `auth/jwt.js`, which builds a real JWT-format token (Base64URL header, payload and an HMAC-SHA256 signature made with the browser's Web Crypto API).

## Component tree

```
<React.StrictMode>
  <AuthProvider>            <- holds token + user, exposes login() / logout()
    <App>
      ├── user is null  ->  <LoginForm />
      └── user exists   ->  <Dashboard />     (protected UI)
```

## Files and responsibilities

| File | Responsibility |
|------|----------------|
| `auth/jwt.js` | `createToken`, `verifyToken`, `decodeToken`, demo user list |
| `auth/AuthContext.jsx` | Login logic, token storage (localStorage), restores session on refresh, logout |
| `components/LoginForm.jsx` | Username/password inputs, Login button, error message |
| `components/Dashboard.jsx` | Protected view: shows role, userId, expiry, decoded token, Logout |
| `App.jsx` | Gate: renders Dashboard only when authenticated |

## Data model

```
Token payload : { userId, username, role, iat, exp }
Storage key   : "auth_token"  (localStorage)
Context value : { user, token, login(username, password), logout(), error }
```

## Demo users (simulated database)

| username | password | userId | role |
|----------|----------|--------|------|
| admin | admin123 | 1 | admin |
| user | user123 | 2 | user |

## Design decision
Only the token is stored. The user object is always **derived by verifying the token**, so the token is the single source of truth. An expired or tampered token is rejected and removed.

> This is a learning simulation. In production the secret key and signing live on the server, never in browser code.
