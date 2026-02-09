import type { Request, Response } from "express";
import type { Project } from "@/class/Project";
import type { IContext } from "@/types/IContext";

export class Context<
    ReqParams extends Record<string, unknown> = {},
    ReqBody = unknown,
    ReqQuery extends Record<string, unknown> = {},
    ResBody = unknown,
    Locals extends Record<string, unknown> = {},
> implements IContext<ReqParams, ReqBody, ReqQuery, ResBody>
{
    env: Record<string, string>;
    req: IContext<ReqParams, ReqBody, ReqQuery, ResBody>["req"];
    res: IContext<ReqParams, ReqBody, ReqQuery, ResBody>["res"];
    #res: Response<ResBody, Locals>;
    meta: {
        requestId: string;
        startTime: number;
        project: Project;
    };

    constructor(
        project: Project,
        req: Request<ReqParams, ResBody, ReqBody, ReqQuery, Locals>,
        res: Response<ResBody, Locals>,
    ) {
        this.env = project.env;
        this.req = {
            method: req.method,
            path: req.path,
            headers: req.headers as Record<string, string>,
            query: req.query,
            params: req.params,
            body: req.body,
            ip: req.ip || req.socket.remoteAddress,
        };
        this.#res = res;
        this.res = {
            status: 200,
            headers: {},
            body: undefined as ResBody,
            type: "application/json",
        };
        this.meta = {
            requestId: crypto.randomUUID(),
            startTime: Date.now(),
            project,
        };
    }

    status(status: number) {
        this.res.status = status;
        return this;
    }

    header(key: string, value: string) {
        this.res.headers[key] = value;
        return this;
    }

    json(data: ResBody): this {
        this.res.body = data;
        this.res.type = "application/json";
        return this;
    }

    text(data: string): this {
        this.res.body = data as ResBody;
        this.res.type = "text/plain";
        return this;
    }

    html(data: string): this {
        this.res.body = data as ResBody;
        this.res.type = "text/html";
        return this;
    }

    redirect(url: string, status: number = 302): this {
        this.status(status);
        this.header("Location", url);
        return this;
    }

    finish() {
        this.#res.status(this.res.status);
        this.#res.type(this.res.type);

        Object.entries(this.res.headers).forEach(([key, value]) => {
            this.#res.setHeader(key, value);
        });

        if (!this.res.body) {
            this.#res.end();
        } else if (this.res.type.includes("json")) {
            this.#res.json(this.res.body);
        } else {
            this.#res.send(this.res.body);
        }
    }

    get requestId() {
        return this.meta.requestId;
    }
}
