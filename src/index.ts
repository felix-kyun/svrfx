import express from "express";
import { Registry } from "@/class/Registry";
import { FN_DIR, PORT } from "@/config";
import { logger } from "@/log/log";

const app = express();
const registry = new Registry(app);

await registry.scan(FN_DIR);

app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
