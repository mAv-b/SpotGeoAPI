import { Router } from "express";
import usersRouter from "./users";
import placesRouter from "./places";
import areasRouter from './areas';

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/places", placesRouter);
routes.use("/areas", areasRouter);

export default routes;