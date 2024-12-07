import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";

import { indexRouter } from "./routes";

const app: Express = express();
dotenv.config();

// Convert port to a number explicitly
const port = parseInt(process.env.PORT || "8080", 10);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express TypeScript Server is Running");
});

app.use(indexRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`✨[server]: Server is running on port ${port}`);
});
