import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Connect to MongoDB using the URI stored in .env
mongoose.connect(process.env.MONGO_URI);

export default mongoose.connection;