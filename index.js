const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://0d1038ca38c71c2c43f713d0c2aa58c5@o447951.ingest.us.sentry.io/4507655858946048",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  debug: true,
  beforeSend(event) {
    console.log("beforeSend", event);
    return event;
  },
});

const express = require("express");
const app = express();
Sentry.captureMessage("one init test"); //is Working

const port = 3000;

app.get("/", (req, res) => {
  Sentry.captureMessage("index message"); //not Working
  res.send("Hello World!");
});

app.get("/error", (req, res) => {
  throw new Error("Broke!"); //not Working
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!"); //not Working
});

Sentry.setupExpressErrorHandler(app);

// Optional fallthrough error handler
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
