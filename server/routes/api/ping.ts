// Nitro server route: handles GET /api/ping and POST /api/ping
// Tracks live listener sessions in memory.
import { defineEventHandler, getMethod, readBody, setResponseHeaders, setResponseStatus } from "h3";

const sessions = new Map<string, number>();
const SESSION_TIMEOUT_MS = 30_000;

function cleanup() {
  const now = Date.now();
  for (const [id, ts] of sessions) {
    if (now - ts > SESSION_TIMEOUT_MS) sessions.delete(id);
  }
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, { "Content-Type": "application/json" });

  const method = getMethod(event);

  if (method === "POST") {
    let body: any;
    try {
      body = await readBody(event);
    } catch {
      setResponseStatus(event, 400);
      return JSON.stringify({ error: "Invalid JSON" });
    }

    const sessionId = body?.sessionId;
    if (!sessionId || typeof sessionId !== "string") {
      setResponseStatus(event, 400);
      return JSON.stringify({ error: "Missing sessionId" });
    }

    cleanup();
    sessions.set(sessionId, Date.now());
    return JSON.stringify({ count: sessions.size });
  }

  // GET — just return current count
  cleanup();
  return JSON.stringify({ count: sessions.size });
});
