import express, { Router } from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.middleware';
import { scopePerRequest } from 'awilix-express';
import container from './container';
import authRouter from './routes/auth.routes';
import categoryRouter from './routes/categories.routes';
import imageRouter from './routes/imageAnalysis.routes';
import reportRouter from './routes/reports.routes';
import roadRouter from './routes/road.routes';
import zoneRouter from './routes/zones.routes';
import groupRouter from './routes/group.routes';
import userRouter from './routes/user.routes';
//import { disableOldReport } from './cron/disableOldReport.cron'

const server = express();

server.use(express.json());
server.use("/static", express.static('public'));
server.use(express.urlencoded({ extended: true }));
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

server.use(scopePerRequest(container));
const routes: { route: Router; uri: string }[] = [
    { route: authRouter, uri: '/auth' },
    { route: categoryRouter, uri: '/categories' },
    { route: groupRouter, uri: '/group' },
    { route: imageRouter, uri: '/imageAnalysis' },
    { route: reportRouter, uri: '/reports' },
    { route: roadRouter, uri: '/road' },
    { route: zoneRouter, uri: '/zones' },
    { route: userRouter, uri: '/user' }
];

routes.forEach(({ route, uri }) => {
    console.log(`Adding route /api${uri}`);
    server.use(`/api${uri}`, route);
});

server.use('/', (_req, res) => {
    res.send('Welcome to the Road Analyzer API');
});


server.use(errorHandler)
server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    //disableOldReport.start()
})

export { server};
