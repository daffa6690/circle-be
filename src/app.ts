import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import rootRouter from './routes/root-route';
import authRouter from './routes/auth-route';
import userRouter from './routes/user-route';
import likeRouter from './routes/like-route';
import followRouter from './routes/follow-route';
import threadRouter from './routes/thread-route';
import replyRouter from './routes/reply-route';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger/swagger-output.json';
import cors from 'cors';
import { errorHandler } from './middlewares/error-middleware';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT;
const whitelist = [
  'http://localhost:5173',
  'https://circleku.vercel.app'
  
];
dotenv.config();
app.use(cookieParser());

app.use(express.json());

app.use(
  cors({
    origin: whitelist,
    credentials: true,
  })
);


app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    customSiteTitle: 'Circle App API',
    customfavIcon: 'NONE',
    isExplorer: true,
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customCss: `
            .swagger-ui .topbar { display: none } 
            .information-container.wrapper { background:rgb(255, 0, 0); padding: 2rem } 
            .information-container .info { margin: 0 } 
            .information-container .info .main { margin: 0 !important} 
            .information-container .info .main .title { color:rgb(255, 254, 254)} 
            .renderedMarkdown p { margin: 0 !important; color:rgb(255, 255, 255) !important }
            `,
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
),
app.use(rootRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/threads', threadRouter);
app.use('/replies', replyRouter);
app.use('/likes', likeRouter);
app.use('/follows', followRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.info(`server running at port ${port}`);
});
