const http = require("http");
const os = require("os");

const port = Number(process.env.PORT) || 8080;
const version = process.env.APP_VERSION || "v1";
const startedAt = new Date();
let requests = 0;

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }

  requests++;

  if (req.url === "/api/info") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        version,
        hostname: os.hostname(),
        startedAt: startedAt.toISOString(),
        uptimeSeconds: Math.round(process.uptime()),
        requests,
        greeting: process.env.GREETING || null,
      })
    );
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Compulyst sample</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0;
           display: grid; place-items: center; min-height: 100vh; margin: 0; }
    .card { background: #1e293b; padding: 2rem 3rem; border-radius: 12px; }
    h1 { margin-top: 0; }
    .version { font-size: 3rem; font-weight: 700; color: #38bdf8; }
    td { padding: 4px 16px 4px 0; }
    td:first-child { color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello from Compulyst</h1>
    <div class="version">${version}</div>
    <table>
      <tr><td>Container</td><td>${os.hostname()}</td></tr>
      <tr><td>Started</td><td>${startedAt.toISOString()}</td></tr>
      <tr><td>Requests</td><td>${requests}</td></tr>
      <tr><td>Greeting</td><td>${process.env.GREETING || "(set GREETING env var)"}</td></tr>
    </table>
  </div>
</body>
</html>`);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`sample app ${version} listening on :${port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, closing`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 10000).unref();
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
