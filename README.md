# Matchy UI (React)

This is a React recreation of the provided **Matchy** UI (Home → Setup → Shuttles → Manage → Messages/Profile), using the original CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

## Notes
- State is stored in **localStorage** (mock shuttles + user points/badges), just like the original HTML prototype.
- The “AI matching” is a **deterministic client-side matcher** (`simpleMatch`) so you can demo without any API keys.
- If you want real LLM matching later, replace `simpleMatch()` in `src/pages/Shuttles.jsx` with your API call.
