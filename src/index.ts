import express from "express";
import http from "http";
import connectDB from "./config/db-connect.ts";
import routes from "./routes/index.ts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// api routes
import userRoute from "./routes/user.routes.ts";
app.use("/api", userRoute);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
