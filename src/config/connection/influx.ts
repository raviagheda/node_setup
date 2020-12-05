import { FieldType, InfluxDB, escape } from 'influx';
import { MEASUREMENTS } from '../../constants/constant';
import config from '../env';

const Influx = new InfluxDB({
  host: config.influxDatabase.host,
  port: parseInt(config.influxDatabase.port, 10),
  database: config.influxDatabase.dbName,
  schema: [
    {
      measurement: 'response_times',
      fields: {
        path: FieldType.STRING,
        duration: FieldType.INTEGER,
        new: FieldType.STRING,
      },
      tags: ['host', 'some'],
    },
  ],
});

const UserInflux = new InfluxDB({
  host: config.influxDatabase.host,
  port: parseInt(config.influxDatabase.port, 10),
  database: config.influxDatabase.dbName,
  schema: [
    {
      measurement: MEASUREMENTS.USER,
      fields: {
        email: FieldType.STRING,
        password: FieldType.STRING,
      },
      tags: [],
    },
  ],
});

export { Influx, UserInflux };
