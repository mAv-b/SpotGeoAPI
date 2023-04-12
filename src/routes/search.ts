import { Router } from "express";
import { SearchController } from "../controllers/search";

const routes = Router();

routes.get('/', SearchController.byRadius);

export default routes;