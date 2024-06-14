import express, {Router} from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.middleware';
import authRouter from './routes/auth.routes';
import categoryRouter from './routes/categories.routes';
import groupRouter from './routes/group.routes';
import imageRouter from './routes/imageAnalysis.routes';
import reportRouter from './routes/reports.routes';
import roadRouter from './routes/road.routes';
import zoneRouter from './routes/zones.routes';

const server = express();

server.use(express.json());
server.use('/static', express.static('public'));
server.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions));

const routes: { route: Router; uri: string }[] = [
  { route: authRouter, uri: '/auth' },
  { route: categoryRouter, uri: '/categories' },
  { route: groupRouter, uri: '/group' },
  { route: imageRouter, uri: '/image' },
  { route: reportRouter, uri: '/reports' },
  { route: roadRouter, uri: '/road' },
  { route: zoneRouter, uri: '/zone' },
];

routes.forEach(({ route, uri }) => server.use(`/api${uri}`, route));


server.use(errorHandler);

const PORT = process.env.PORT as string || "8080";
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;
