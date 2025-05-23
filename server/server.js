import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import process from 'node:process';
import colors from 'colors';
import usersRouter from './routers/users.router.js';
import transactionsRouter from './routers/transactions.router.js';
import adminRouter from './routers/admin.routes.js';
import visitRoutes from './routers/visit.routes.js';
import 'dotenv/config';
import './config/passport.config.js';
import monitorRoutes from './routers/email.routes.js'; // makes it available at /api/email-ping
import swaggerOutput from './swagger-output.js';
import swaggerUi from 'swagger-ui-express';

const app = express(); // Moved this up here!

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(morgan(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use('/users', usersRouter);
app.use('/transactions', transactionsRouter);
app.use('/api/visits', visitRoutes);
app.use('/admin', adminRouter); // Now it's safe here!
app.use('/api', monitorRoutes);

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'The given endpoint does not exist',
    data: 'Not found',
  });
});

app.use((error, _, res, __) => {
  console.log(error.stack);
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: error.message,
    data: 'Internal server error',
  });
});

const PORT = (process.env.NODE_ENV === 'production' ? process.env.PORT : 5000) || 4030;

const databaseURI = process.env.DATABASE_URI;
const connection = mongoose.connect(databaseURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    console.log(colors.yellow('Database connecting...'));
    app.listen(PORT, () => {
      console.log(colors.green('Database connection is successful'));
      console.log(colors.green(`The server running on port: ${PORT}`));
    });
  })
  .catch(error => {
    console.log(colors.red(`Something wrong with the server, because of: ${error.message}`));
    process.exit(1);
  });

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal =>
  process.on(signal, () => {
    mongoose.disconnect();
    console.log(colors.magenta('Database disconnected.'));
    process.exit();
  }),
);
