import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import db from "./config/connection.js";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

db.once("open", () => {
  console.log("Connected to MongoDB database");
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
