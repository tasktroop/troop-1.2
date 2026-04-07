const winston = require('winston');

// Custom transport for Logflare
const logflareTransport = new winston.transports.Http({
  host: 'api.logflare.app',
  path: `/logs/winston?api_key=${process.env.LOGFLARE_API_KEY || 'PUHaKvTHgOYx'}&source=LeadOS-Backend`,
  ssl: true,
  batch: true,
  batchCount: 5
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'leados-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    logflareTransport
  ],
});

module.exports = logger;
