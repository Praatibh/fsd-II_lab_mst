# Theory: Architecture

## 1. Authentication
Authentication is the process of verifying **who a user is** ("Are you really Alice?"), usually with credentials such as a username and password, an OTP, or a biometric.
It is different from **authorization**, which decides **what** an authenticated user may do (for example, only an admin can delete users).

## 2. JWT (JSON Web Token)
A JWT is a compact, URL-safe string that carries claims (facts about the user) and is **digitally signed** so it cannot be altered without detection. Once issued, the client sends it with each request, so the server does not need to keep a session for every user (stateless authentication).

### Structure: three Base64URL parts separated by dots

```
xxxxx.yyyyy.zzzzz
Header . Payload . Signature
```

| Part | Contains | Example |
|------|----------|---------|
| Header | Token type and signing algorithm | `{"alg":"HS256","typ":"JWT"}` |
| Payload | Claims: userId, role, issued-at (iat), expiry (exp) | `{"userId":1,"role":"admin","exp":1767225600}` |
| Signature | `HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)` | proves the token was not tampered with |

Important: the payload is **encoded, not encrypted**. Anyone can read it, so never put passwords or secrets in it. The signature only guarantees integrity.

## 3. System components

```
+-----------+      1. credentials       +--------------------+      +-----------+
|  Client   | ------------------------> |   Auth Server /    | ---> | User DB   |
| (Browser) | <------------------------ |   API (issues JWT) | <--- | (users +  |
|           |      2. signed JWT        +--------------------+      | password  |
|           |                                                       |  hashes)  |
|           |      3. request + JWT     +--------------------+      +-----------+
|           | ------------------------> |  Protected API     |
|           | <------------------------ |  (verifies JWT)    |
+-----------+      4. protected data    +--------------------+
```

- **Client**: collects credentials, stores the token, attaches it to requests.
- **Auth server**: validates credentials, creates and signs the JWT.
- **Protected API**: verifies signature and expiry on every request, then reads userId and role from the payload.
- **Secret key**: known only to the server; used to sign and verify.
