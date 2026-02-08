import { logger } from "@/log/log";

export async function pinoFlush() {
    return new Promise<void>((resolve) => {
        logger.flush(() => resolve(undefined));
    });
}
