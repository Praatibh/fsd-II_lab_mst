# Question 2: Simple JWT Authentication

```
Q2-Simple-JWT-Authentication/
├── README.md
├── theory/
│   ├── question.md        <- Part A question
│   ├── architecture.md    <- What a JWT is made of + system components
│   └── workflow.md        <- Login -> token -> protected request steps
└── practical/
    ├── question.md        <- Part B question
    ├── architecture.md    <- React component/file architecture
    ├── workflow.md        <- Runtime flow of the login system
    └── react-app/         <- Runnable Vite + React project
        ├── package.json
        ├── index.html
        └── src/
            ├── main.jsx
            ├── App.jsx
            ├── styles.css
            ├── auth/
            │   ├── jwt.js          <- token create / decode / verify (simulated)
            │   └── AuthContext.jsx <- login state + token storage
            └── components/
                ├── LoginForm.jsx
                └── Dashboard.jsx
```

Run the practical part:

```bash
cd practical/react-app
npm install
npm run dev
```

Demo accounts: `admin / admin123` (role admin) and `user / user123` (role user).
