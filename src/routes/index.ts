import { Router } from "express";
import usersRouter from "./users";
import placesRouter from "./places";

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/places", placesRouter);

export default routes;