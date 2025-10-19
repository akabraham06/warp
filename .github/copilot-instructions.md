<!-- .github/copilot-instructions.md -->
# Quick instructions for AI coding agents

These notes help an AI be immediately productive in the Warp / Cross-Currency Platform repository.

Keep this concise — focus on the project's structure, developer workflows, and concrete examples you can edit.

1. Big-picture architecture
   - This repo is a lightweight monorepo with a Python backend and a React frontend.
     - Backend: FastAPI app at `backend/main.py` exposing endpoints like `/quote`, `/transfer/execute`, `/user/me`, `/transfer/history`, and `/health`.
     - Frontend: React app in `frontend/` (create-react-app). Entry point `frontend/src/App.js`, uses `AuthContext` and `ProtectedRoute`.
   - Key services (single-file service objects): `cex_integration.py`, `dex_aggregator.py`, `enhanced_fx_platform.py` — backend imports these directly from the repo root.
   - Firebase is used for auth and Firestore in `backend/main.py` (service account file at `backend/firebase-service-account.json`). Code supports a mock token `mock-firebase-token-123` for local development.

2. How to run & test (developer workflows)
   - Backend (development):
     - Ensure dependencies in `backend/requirements.txt` are installed and env vars set (optionally via `.env`).
     - Run the API locally:
       ```bash
       python backend/main.py
       # or
       uvicorn backend.main:app --reload --port 8000
       ```
     - The README top-level also shows quick-start commands for running UI and analysis scripts (e.g., `python seamless_transaction_ui.py`).
   - Frontend:
     - Install and run with standard CRA commands from `frontend/`:
       ```bash
       cd frontend
       npm install
       npm start
       ```
   - Tests:
     - Python tests: run `python test_end_to_end.py` and `python test_dex_integration.py` from the repo root.
     - Frontend tests: `npm test` inside `frontend/`.

3. Project-specific conventions and patterns
   - Single-file service modules: `cex_integration.py`, `dex_aggregator.py`, `enhanced_fx_platform.py` expose service classes used directly by `backend/main.py` (e.g., `CEXAggregatorService`, `DEXAggregatorService`, `FXRateService`). Edit these services when changing quoting/on-ramp logic.
   - Synchronous and asynchronous mix: FastAPI endpoints call async helper functions (`call_fx_api`, `call_coinbase_api`, `call_1inch_api`) which in turn call methods on the service classes. Preserve async signatures when modifying flows.
   - Local dev safety: Firebase initialization falls back to None if service account loading fails — many endpoints return mock data when `db` is falsy. Use the `mock-firebase-token-123` header token to bypass real Firebase during integration tests.
   - Quote cache: in-memory dict `quote_cache` in `backend/main.py` — ephemeral, not persisted. For work that needs persistence, prefer adding Redis integration (note this is currently intentionally simple).
   - Currency casing: code sometimes uses `.lower()` when reading balances (Firestore documents expect lowercase keys). Preserve or normalize currency keys to lowercase when updating balances.

4. Integration points & external dependencies
   - Exchange rate calls: `call_fx_api` talks to exchangerate-api.com as primary, then falls back to `FXRateService`.
   - CEX on-ramp: `CEXAggregatorService` / `cex_integration.py` — code expects `coinbase.get_fiat_to_crypto_quote(...)` interface (see usage in `call_coinbase_api`).
   - DEX swap: `DEXAggregatorService` / `dex_aggregator.py` — backend calls `dex_service.get_chain_info(chain)` and simulates 1inch swaps via `call_1inch_api`.
   - Firebase Admin SDK: `backend/firebase-service-account.json` is required for real Firestore/auth flows. The code gracefully handles missing credentials for local dev.

5. Editing tips & examples
   - To add a new route that needs quoting, follow `calculate_best_quote` pattern: call `call_fx_api` for mid-market, then test crypto paths using `find_best_crypto_path`. Return a `QuoteResponse` Pydantic model.
   - To add a new chain: add it to `chains` list in `find_best_crypto_path` and ensure `dex_aggregator.get_chain_info` supports it.
   - When changing authentication: `verify_firebase_token` accepts a mock token. If you modify token flow, update tests that depend on `mock-firebase-token-123`.
   - When updating frontend API calls: frontend service file `frontend/src/services/api.js` centralizes HTTP requests; update base URL or headers there.

6. Files to read first (high-signal)
   - `backend/main.py` — primary API and business flows
   - `cex_integration.py`, `dex_aggregator.py`, `enhanced_fx_platform.py` — core integrations
   - `frontend/src/services/api.js` — frontend <> backend communication
   - `frontend/src/contexts/AuthContext.js` and `frontend/src/components/ProtectedRoute.js` — auth flow and route protection

7. Quick pitfalls to avoid
   - Don't remove the mock token or `db` fallback unless you update tests and local dev docs.
   - Preserve async/await boundaries in backend endpoints to avoid blocking the event loop.
   - Keep currency keys lowercase when reading/writing balances in Firestore documents.

If any of this is unclear or you want me to expand a section (run commands, add examples, or merge an existing instruction file), tell me what to clarify and I'll iterate.
