import type { Request, Response } from "express";
import type { Project } from "@/class/Project";
import type { IContext, IRequest, IResponse } from "@/types/IContext";

export class Context<TRequestBody = unknown, TResponseBody = unknown>
    implements IContext
{
    private constructor(
        public readonly env: Record<string, string>,
        public readonly req: IRequest<TRequestBody>,
        public readonly res: IResponse<TResponseBody>,
        public readonly meta: {
            requestId: string;
            startTime: number;
            project: Project;
        },
    ) {}

    static from<T>(project: Project, req: Request<T>) {
        const request: IRequest = {
            method: req.method,
            path: req.path,
            headers: req.headers as Record<string, string>,
            query: req.query as Record<string, string>,
            body: req.body as T,
            ip: req.ip || req.socket.remoteAddress,
        };

        const response: IResponse = {
            status: 200,
            headers: {},
            body: null,
            type: "application/json",
        };

        return new Context(project.env, request, response, {
            requestId: crypto.randomUUID(),
            startTime: Date.now(),
            project,
        });
    }

    status(status: number) {
        this.res.status = status;
        return this;
    }

    header(key: string, value: string) {
        this.res.headers[key] = value;
        return this;
    }

    json(data: TResponseBody): this {
        this.res.body = data;
        this.res.type = "application/json";
        return this;
    }

    text(data: string): this {
        this.res.body = data as TResponseBody;
        this.res.type = "text/plain";
        return this;
    }

    html(data: string): this {
        this.res.body = data as TResponseBody;
        this.res.type = "text/html";
        return this;
    }

    redirect(url: string, status: number = 302): this {
        this.status(status);
        this.header("Location", url);
        return this;
    }

    finish(res: Response) {
        res.status(this.res.status);
        res.type(this.res.type);

        Object.entries(this.res.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });

        if (!this.res.body) {
            res.end();
        } else if (this.res.type.includes("json")) {
            res.json(this.res.body);
        } else {
            res.send(this.res.body);
        }
    }

    get requestId() {
        return this.meta.requestId;
    }
}
