const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf, errors } = format;

const rTracer = require('cls-rtracer');

// a custom format that outputs request id
const rTracerFormat = printf((info) => {
  const rid = rTracer.id();

  const logMessage = {
    timestamp: info.timestamp,
    service: info.service,
    message: info.message,
    stack: info.stack,
  };

  if (rid) {
    logMessage.requestid = rid;
  }

  if (info && info.httpRequest) {
    const reqInfo = JSON.stringify(info.httpRequest);

    logMessage.reqinfo = reqInfo;
  }

  return JSON.stringify(logMessage);
});

const logger = createLogger({
  defaultMeta: {
    service: process.env.PROJECT_NAME,
  },
  level: 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true })
  ),
  transports: [
    new transports.Console({
      level: 'info',
      handleExceptions: true,
      format: combine(rTracerFormat),
    }),
  ],
});

module.exports = logger;
