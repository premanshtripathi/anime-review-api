import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true, // extended is used for objects inside objects.
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// routes import
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";
import animeRouter from "./routes/anime.routes.js";
import reviewRouter from "./routes/review.routes.js";

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/anime", animeRouter);
app.use("/api/v1/reviews", reviewRouter);

const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL("./swagger-output.json", import.meta.url))
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { app };
