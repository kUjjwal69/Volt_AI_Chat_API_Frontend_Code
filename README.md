# GroqChat UI — Angular Frontend

A production-ready ChatGPT-like frontend for the ASP.NET Core / Groq backend.

## Quick Start

```bash
npm install
ng serve
```

Open http://localhost:4200

## Backend Connection

The dev server proxies `/api/*` to `https://localhost:7000` via `proxy.conf.json`.

Change the target port in `proxy.conf.json` if your backend runs elsewhere.

For production, update `src/environments/environment.prod.ts` with your API URL.

## Features
- Multi-session chat with sidebar navigation
- Typing animation (character-by-character streaming effect)
- Sessions persist in localStorage
- Fully responsive — sidebar collapses on mobile
- Welcome screen with suggestion chips
- Error handling with dismissable toasts

## Build for Production
```bash
ng build --configuration production
```
