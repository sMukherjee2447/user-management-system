import express from "express";
import http from "http";
import connectDB from "./config/db-connect.ts";
import logger from "./middleware/logger.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(logger.requestLogger);

// api routes
import userRoute from "./routes/user.routes.ts";
app.use("/api", userRoute);

// admin routes
import adminRoute from "./routes/admin.routes.ts";
app.use("/api/admin", adminRoute);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  await connectDB();
  await logger.fetchRecentUsers();
  console.log(`\nServer running on port ${PORT}`);
});
