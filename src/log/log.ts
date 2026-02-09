import pino from "pino";
import { ENV, LOG_LEVEL } from "@/config";
import { pinoFlush } from "@/log/pinoFlush";
import { root } from "@/utils/root";

const transport = pino.transport({
    targets: [
        {
            level: LOG_LEVEL,
            target: "pino-roll",
            options: {
                file: `${root()}/logs/app.log`,
                mkdir: true,
                sync: false,
                size: "10m",
                frequency: "daily",
                symlink: true,
                limit: {
                    count: 10,
                    removeOtherLogFiles: true,
                },
            },
        },
        {
            level: "error",
            target: "pino-roll",
            options: {
                file: `${root()}/logs/error.log`,
                mkdir: true,
                sync: true,
                size: "10m",
                frequency: "daily",
                symlink: true,
                limit: {
                    count: 10,
                    removeOtherLogFiles: true,
                },
            },
        },
        ...(ENV !== "production"
            ? [
                  {
                      level: "debug",
                      target: "pino-pretty",
                      options: {
                          colorize: true,
                          destination: 1,
                          translateTime: "HH:MM:ss",
                          ignore: "pid,hostname",
                      },
                  },
              ]
            : []),
    ],
});

export const logger = pino(
    {
        level: LOG_LEVEL,
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport,
);

process.on("uncaughtException", async (err) => {
    logger.error({ err }, "Uncaught Exception");
    await pinoFlush();
    process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
    logger.error({ reason }, "Unhandled Rejection");
    await pinoFlush();
    process.exit(1);
});
