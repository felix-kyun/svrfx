import type { IContext } from "@/types/IContext";

export type Handler = (context: IContext) => Promise<void>;
