import mongoose, { ConnectOptions } from 'mongoose';
import config from '../config';
import { log } from '../../utils';

const connect = () => {
  const dbUri = config.get('dbUrl') as string;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() => {
      log.info('Database connected successfully');
    })
    .catch((err) => {
      log.error('db error', err);
      process.exit(1);
    });
};

export default connect;
