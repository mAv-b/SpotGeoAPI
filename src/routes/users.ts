import { Router } from "express";
import { UserController } from "../controllers";

const routes = Router();

routes.post('/login/', UserController.authorization);

export default routes;