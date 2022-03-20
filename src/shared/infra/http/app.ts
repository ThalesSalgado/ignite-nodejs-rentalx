import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import "@shared/container";
import { AppError } from "@shared/errors/AppError";
import createConnection from "@shared/infra/typeorm";

import swaggerFile from "../../../swagger.json"; // Check tsconfig.json file has "resolveJsonModule": true
import { router } from "./routes";

createConnection();
const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Ìnternal server error - ${err.message}`,
    });
  }
);

export { app };

// app.get("/", (request, response) => {
//   return response.json({ message: "Hello world" });
// });

// app.post("/courses", (request, response) => {
//   const { name } = request.body;
//   return response.json({ name });
// });
