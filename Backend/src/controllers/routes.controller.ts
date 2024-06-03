import { Request, Response, NextFunction } from 'express';
import * as routeService from '../services/routes.service';

async function getRoutes(_req: Request, res: Response, next: NextFunction) {
    try {
        const routes = await routeService.getRoutes();
        res.status(200).send(routes);
    } catch (error) {
        const aux = (error as Error)
        next({ status: 500, message: aux.message})
    }
}

export { getRoutes }
