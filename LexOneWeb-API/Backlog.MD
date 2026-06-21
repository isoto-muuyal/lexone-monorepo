For me Israel:

Yes — found it. Your web_src/.env points the frontend at the old TuDoFy backend:


REACT_APP_BASE_URL=https://tudofyapp.com:3000
REACT_APP_SOCKET_URL=https://tudofyapp.com:8081
REACT_APP_MEDIA_URL=https://tudofyapp.com
REACT_APP_FRONT_BASE_URL=https://tudofyapp.com/web
Let me check .env.local since it can override .env, and confirm whether mock auth is masking real API calls.

Bash
IN
cat /Users/isoto/workspace/TUDO/LexOneWeb-API/web_src/.env.local
echo "---mockAuth check---"
grep -n "REACT_APP_MOCK_AUTH\|MOCK_AUTH" -r /Users/isoto/workspace/TUDO/LexOneWeb-API/web_src/src 2>/dev/null | grep -v node_modules

OUT
---mockAuth check---
/Users/isoto/workspace/TUDO/LexOneWeb-API/web_src/src/utils/mockAuth.js:115:    if (process.env.REACT_APP_MOCK_AUTH === 'false') {
.env.local is empty, so it doesn't override anything — tudofyapp.com is live.

Yes, when you run the frontend locally it makes real API calls to tudofyapp.com (the old backend), because:

REACT_APP_MOCK_AUTH=true is set in web_src/.env, but mockAuth.js:115 only disables mocking when the value is exactly 'false' — true means mocking is active for auth only (login/register flows), not for everything else.
All other API/data calls (general settings, jobs, bookings, chat, media uploads, etc.) use REACT_APP_BASE_URL, REACT_APP_SOCKET_URL, and REACT_APP_MEDIA_URL — all pointed at https://tudofyapp.com. That's also exactly where the site_name: "TuDoFy" value you saw in the tab title is coming from — your local frontend is hitting the production TuDoFy backend and rendering whatever settings live there.
To stop calling the TuDoFy backend locally, you'd want to update web_src/.env (or .env.local) to point at your own local/LexOne API host, e.g.:


REACT_APP_BASE_URL=http://localhost:<your-api-port>
REACT_APP_SOCKET_URL=http://localhost:<your-socket-port>
REACT_APP_MEDIA_URL=http://localhost:<your-api-port>
REACT_APP_FRONT_BASE_URL=http://localhost:3000