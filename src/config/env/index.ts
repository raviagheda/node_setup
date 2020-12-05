import * as dotenv from 'dotenv';

dotenv.config();

interface IConfig {
  port: string | number;
  secret: string;
  type: string;
  host: string;
  version: string;
  whitelist: string[];

  swagger?: {
    username: string;
    password: string;
  };
  database: {
    host: string;
    port: string;
    dbName: string;
    authenticate: {
      username: string;
      password: string;
    };
  };
  influxDatabase: {
    host: string;
    port: string;
    dbName: string;
    authenticate: {
      username: string;
      password: string;
    };
  };
  supportEmail: string;
  webURL: string;
  defaultTokenExpiryTimeInHours: number;
  validation: {
    password: string;
    username: string;
    email: string;
    website: string;
  };
}
const whitelist: string[] = [
  `http://localhost:${process.env.port || 3000}`,
  `http://127.0.0.1:${process.env.port || 3000}`,
];

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const swagger: any = {
  username: process.env.SWAGGER_DOC_USERNAME,
  password: process.env.SWAGGER_DOC_PASS,
};

const development: IConfig = {
  whitelist,
  swagger,
  type: 'DEV',
  host: process.env.DEV_HOST,
  port: process.env.DEV_PORT,
  database: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    dbName: process.env.DEV_DB_NAME,
    authenticate: {
      username: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASS,
    },
  },
  influxDatabase: {
    host: process.env.DEV_influxDB_HOST,
    port: process.env.DEV_influxDB_PORT,
    dbName: process.env.DEV_influxDB_NAME,
    authenticate: {
      username: process.env.DEV_influxDB_USER,
      password: process.env.DEV_influxDB_PASS,
    },
  },
  version: '1.0.0',
  secret: process.env.DEV_secret,
  webURL: process.env.DEV_webURL,
  supportEmail: process.env.DEV_supportEmail,
  defaultTokenExpiryTimeInHours: 24,
  validation: {
    password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{6,20})$',
    username: '^((?=.*[a-zA-Z0-9]).{6,20})$',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    website:
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  },
};

const production: IConfig = {
  whitelist,
  swagger,
  type: 'PROD',
  host: process.env.host || 'localhost',
  port: process.env.port || 3000,
  version: '1.0.0',
  database: {
    host: process.env.PROD_DB_HOST,
    port: process.env.PROD_DB_PORT,
    dbName: process.env.PROD_DB_NAME,
    authenticate: {
      username: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASS,
    },
  },
  influxDatabase: {
    host: process.env.PROD_influxDB_HOST,
    port: process.env.PROD_influxDB_PORT,
    dbName: process.env.PROD_influxDB_NAME,
    authenticate: {
      username: process.env.PROD_influxDB_USER,
      password: process.env.PROD_influxDB_PASS,
    },
  },
  secret: process.env.PROD_secret,
  webURL: process.env.PROD_webURL,
  supportEmail: process.env.PROD_supportEmail,
  defaultTokenExpiryTimeInHours: 24,
  validation: {
    password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{6,20})$',
    username: '^((?=.*[a-zA-Z0-9]).{6,20})$',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    website:
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  },
};

const qa: IConfig = {
  whitelist,
  swagger,
  type: 'QA',
  host: process.env.host || 'localhost',
  port: process.env.port || 3000,
  version: '1.0.0',
  database: {
    host: process.env.STAGING_DB_HOST,
    port: process.env.STAGING_DB_PORT,
    dbName: process.env.STAGING_DB_NAME,
    authenticate: {
      username: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASS,
    },
  },
  influxDatabase: {
    host: process.env.STAGING_influxDB_HOST,
    port: process.env.STAGING_influxDB_PORT,
    dbName: process.env.STAGING_influxDB_NAME,
    authenticate: {
      username: process.env.STAGING_influxDB_USER,
      password: process.env.STAGING_influxDB_PASS,
    },
  },
  secret: process.env.STAGING_secret,
  webURL: process.env.STAGING_webURL,
  supportEmail: process.env.STAGING_supportEmail,
  defaultTokenExpiryTimeInHours: 24,
  validation: {
    password: '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{6,20})$',
    username: '^((?=.*[a-zA-Z0-9]).{6,20})$',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$',
    website:
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  },
};

const config: {
  [name: string]: IConfig;
} = {
  qa,
  development,
  production,
};

export default config[NODE_ENV];
