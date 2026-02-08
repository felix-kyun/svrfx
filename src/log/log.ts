import pino from "pino";
import { ENV, LOG_LEVEL } from "@/config";
import { root } from "@/utils/root";

const transport = pino.transport({
    targets: [
        {
            level: LOG_LEVEL,
            target: "pino/file",
            options: {
                destination: `${root()}/logs/app.log`,
                mkdir: true,
                sync: false,
            },
        },
        {
            level: "error",
            target: "pino/file",
            options: {
                destination: `${root()}/logs/error.log`,
                mkdir: true,
                sync: false,
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
