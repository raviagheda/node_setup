import * as mongoose from 'mongoose';
import config from '../env';

interface IConnectOptions {
  autoReconnect?: boolean;
  reconnectTries?: number; // Never stop trying to reconnect
  reconnectInterval?: number;
  loggerLevel?: string;
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
  useCreateIndex: boolean;
  useFindAndModify: boolean
}

const connectOptions: IConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

const MONGO_URI: string = `${config.database.host}:${config.database.port}/${config.database.dbName}`;

export const db: mongoose.Connection = mongoose.createConnection(MONGO_URI, connectOptions);

// handlers
db.on('connecting', () => {
  console.log('\x1b[32m', 'MongoDB :: connecting');
});

db.on('error', (error) => {
  console.log('\x1b[31m', `MongoDB :: connection ${error}`);
  mongoose.disconnect();
});

db.on('connected', () => {
  console.log('\x1b[32m', 'MongoDB :: connected');
});

db.once('open', () => {
  console.log('\x1b[32m', 'MongoDB :: connection opened');
});


db.on('disconnected', () => {
  console.log('\x1b[31m', 'MongoDB :: disconnected');
});

db.on('fullsetup', () => {
  console.log('\x1b[33m"', 'MongoDB :: reconnecting... %d');
});
