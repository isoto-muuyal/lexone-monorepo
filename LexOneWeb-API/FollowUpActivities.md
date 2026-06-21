1. SSH tunnel to the remote MongoDB (you run this)
The production .env already says:


MONGODB_URI = mongodb://tudo_root:Tu$*0A*$yU79XXDa65@localhost:29098/tudo_new
That localhost:29098 is from the remote server's point of view — Mongo is bound to its own loopback, not exposed. So:


ssh -L 29098:127.0.0.1:29098 <ssh-user>@<server-host> -N
-L 29098:127.0.0.1:29098 forwards your local port 29098 → the server's localhost:29098 (where Mongo listens).
-N = no shell, just hold the tunnel open.
Leave this running in its own terminal tab while you work.
Once it's up, mongodb://...@localhost:29098/... from your laptop reaches the real Mongo instance.

2. Use a separate "test" database on the same instance (recommended)
Don't point at tudo_new directly — instead use a different db name, e.g. tudo_test, in the connection string. Mongo creates databases/collections lazily on first write, so this is just a name change in the URI. Only caveat: confirm the tudo_root user's roles allow access to a db other than tudo_new — if it's scoped tightly, you (or whoever admins that Mongo) may need to grant access or create a new user for tudo_test.

This reuses the existing DB server entirely (no new infra), while keeping test writes isolated from production data.

3. Local-only env overrides for node_api
node_api/.env is currently tracked by git and has live production secrets, so any local edits should stay uncommitted. Things to change locally:

MONGODB_URI → mongodb://tudo_root:<password>@localhost:29098/tudo_test
SSL = 0 — both app.js and chat.js read /etc/letsencrypt/live/tudofyapp.com/... when SSL=1, which won't exist on your machine and will crash on startup.
Leave API_PORT=3000, CHAT_PORT=8081 unless those are taken locally.
4. Start the API

cd node_api
npm install   # node_modules already present, but good to confirm
npm start     # runs node ./src/app.js
Look for:

MongoDB is connected (vs. Cannot connect to the mongodb... → tunnel down, wrong port, or auth issue)
Node.js API is running on: 3000
Socket.io is running on: 8081
5. Point the frontend at local API
web_src/.env currently points at https://tudofyapp.com:3000 / :8081. For local testing, change (locally, uncommitted) to http://localhost:3000 / http://localhost:8081.

6. Watch-out
Same Node-version concern as the frontend: mongoose ^5.10.0 / express ^4 are older-generation deps. If npm start in node_api also hangs or throws under Node v24, you may need nvm use 18 (or similar) for this process too.

7. Future backend work
Per your note — no edits to existing routes/controllers/models. Any new endpoints (e.g. for the dashboard data or real AI lawyer matching) get added as new route/controller files registered alongside the existing mainRoutev1 / WebmainRoutev1, purely additive.

Want me to make the local-only .env edits (steps 3/5) once you've confirmed the SSH tunnel and test-db name/credentials?

now for the agent, should I create the agent in this repo or inside the mcp server? or should be another api? tell me the steps to build the agent, recommend the lenguage I know java , python and javascript.
I want to build it my self to elarn, and how to keep memory of the conversation, do I send the whole conversation every time? the agent will use gemini por llm
Where to build it
Not MCP. MCP (Model Context Protocol) is for exposing tools/data to an LLM client in a standardized way — you'd use it if you wanted, say, Claude Desktop to query your lawyer directory as a tool. It's the wrong shape for "user sends a chat message, gets matched lawyers back."
Not bolted into node_api. That stack is on older deps (mongoose 5, express 4) and you don't want new Gemini/agent-framework dependencies tangled into it.
Recommended: a small standalone service — new top-level folder (e.g. agent_api/) with one endpoint, POST /agent/chat. The frontend's /find-lawyers page calls it instead of (or alongside) the local simulateAiLawyerMatch. node_api doesn't need to know it exists — purely additive.
Language
Python, even though your main stack is JS:

Gemini's SDK and almost every agent tutorial/framework (LangChain, LangGraph, Google ADK) is Python-first — best docs/examples to learn from.
FastAPI gets you a clean service in ~30 lines.
Fully isolated experiment — if it doesn't work out, delete the folder, nothing else is affected.
(Node with @google/genai is a fine alternative if you'd rather stay one-language — but Python has the edge specifically for learning agent patterns.)

Steps
Get a Gemini API key (Google AI Studio — free tier is plenty to start).
Create agent_api/ — FastAPI app, one route /chat.
Move MOCK_LAWYERS_DIRECTORY (from web_src/src/utils/aiLawyerMatch.js) server-side as a Python function/dataset the agent can search.
Write a system prompt describing the assistant's role, and expose that lawyer-search as a Gemini "tool" (function calling).
Implement the chat loop: { session_id, message } in → load history → model.generate_content(history + [message], tools=[...]) → handle any tool call → append response → save history.
Return { reply, matches } to the caller.
Point /find-lawyers at this endpoint as the swap-in for simulateAiLawyerMatch.
Test with curl/Postman before wiring up the UI.
Memory / conversation history
LLM APIs are stateless — yes, context gets resent each call, but you don't manage that by hand:

Gemini's SDK has a ChatSession/chat object — call chat.send_message(text) repeatedly and it keeps the running history, serializing it into the request for you.
Store that history server-side, keyed by a session_id (an in-memory dict is fine to start, move to Mongo later). The client only ever sends the new message + session_id.
For a lawyer-matching conversation (a handful of turns), resending the full transcript each call is normal and cheap. Truncation/summarization only matters once conversations run dozens of turns.
Want me to scaffold agent_api/ with a FastAPI /chat endpoint and a stub Gemini call so you have something runnable to start experimenting with?


Created: node_api/Dockerfile, web_src/Dockerfile (+ nginx config), .dockerignores, docker-compose.prod.yml, and .github/workflows/deploy.yml (builds both images on push to main, pushes to GHCR, SCPs the compose file to your EC2 box, then docker compose pull && up -d).

You'll need to set up on your end:

EC2 instance with Docker + Docker Compose installed, port 80/3000/8081 open.
On the instance, in ~/lexone/: a .env file with IMAGE_OWNER=<your-github-username-lowercase> (for compose image substitution), and .env.api with the API's runtime config (Mongo URI, JWT secret, SSL=0, etc.).
GitHub repo secrets: EC2_HOST, EC2_USER, EC2_SSH_KEY, and GHCR_PAT (a PAT with read:packages, so the EC2 box can pull images) — or make the GHCR packages public to skip GHCR_PAT.
On AGENTS.md vs CLAUDE.md: yes, there's an emerging cross-tool convention. OpenAI's Codex CLI (and several other tools — Cursor, Aider, etc.) read AGENTS.md as a tool-agnostic context file. Gemini CLI uses its own GEMINI.md. Claude Code only reads CLAUDE.md.

The standard pattern to avoid duplication: put the real content in AGENTS.md, and make CLAUDE.md (and GEMINI.md if you use Gemini CLI) a one-line pointer to it. Let me restructure the three files I just created that way.

Demo lawyer (demo.lawyer@lexone.local / LexOneDemo123!)

Login already worked — now the post-login screens are covered:
Tasker Home: mock dashboard data (12 total, 8 completed, earnings chart)
My Bookings: 3 ongoing consultations (Carlos, Ana, Miguel) + 2 completed (Roberto, Sofia)
User Jobs / Browse Needs: returns empty list gracefully (no crash)
My Services: returns empty list with "Add service" prompt
Demo user (demo.user@lexone.local) is unchanged — still works as before.

Admin portal — exists at the /admin route (Laravel/PHP):

Login button color: #F14E16 (orange) → #0A214D (LexOne navy)
Active nav items and links: #007bff (blue) → #0A214D (navy)
Sidebar CTAs/active bg: #6d7fcc / #7386D5 (purple) → #C09B4B (LexOne gold)
App name: Tudofyapp2024 → LexOne
Fake admin credentials: admin@lexone.local / LexOneAdmin123!
To create the admin user in the database, run once after the SSH tunnel is up: