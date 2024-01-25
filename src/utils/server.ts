import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connect from "../lib/database/configuration";

async function createServer() {
  const app = express();

  const corsOptions = {
    origin: "*", // Replace with the origin of your front-end application
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable cookies and HTTP authentication
  };

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  await connect();

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
  });

  app.use("/api/", limiter);

  /* health API to check if server is running*/

  app.get("/api/health", (req, res) => {
    res.status(200);
    res.send({
      time: new Date(),
      server: "Backend Engineer Assignment",
      status: "Active",
    });
  });

  return app;
}

export default createServer;
