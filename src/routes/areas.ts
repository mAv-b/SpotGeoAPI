import { Router } from "express";
import { AreaControllers } from "../controllers/areas";

const routes = Router();

routes.get('/', AreaControllers.get);
routes.get('/:id', AreaControllers.get);

routes.post('/', AreaControllers.create);

routes.put('/:id', AreaControllers.put);

routes.delete('/:id', AreaControllers.delete);

export default routes;