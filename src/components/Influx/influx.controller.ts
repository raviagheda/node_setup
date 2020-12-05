// const Influx = require('influx');
import { FieldType, InfluxDB, escape } from 'influx';
const os = require('os');
import { Influx, UserInflux } from '../../config/connection/influx';

export function influxController(req: any, res: any, next: any): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log(`Request to ${req.path} took ${duration}ms`);

    Influx.writePoints([
      {
        measurement: 'response_times',
        tags: { host: os.hostname(), some: 'GOT IT!!' },
        fields: { duration, path: req.path, new: 'new' },
      },
    ]).catch((err: { stack: any }) => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`);
    });
  });
  // return next();
  res.send('something');
}

export function getFromInflux(req: any, res: any, next: any) {
  Influx.query(
    `
    select * from response_times
    where host = ${escape.stringLit(os.hostname())}
    order by time desc
    limit 10
  `
  )
    .then((result: any) => {
      res.json(result);
    })
    .catch((err: { stack: any }) => {
      res.status(500).send(err.stack);
    });
}
