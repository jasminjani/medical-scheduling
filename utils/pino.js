const pino = require('pino');

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `./server.log` },
    },
    {
      target: 'pino-pretty',
    },
  ],
});

module.exports = pino(
  {
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
