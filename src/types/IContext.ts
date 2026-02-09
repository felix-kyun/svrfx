export interface IContext<
    ReqParams extends Record<string, unknown> = {},
    ReqBody = unknown,
    ReqQuery extends Record<string, unknown> = {},
    ResBody = unknown,
    // Locals extends Record<string, unknown> = {},
> {
    env: Record<string, string>;
    req: {
        method: string;
        path: string;
        headers: Record<string, string>;
        params: ReqParams;
        query: ReqQuery;
        body: ReqBody;
        ip: string | undefined;
    };
    res: {
        status: number;
        headers: Record<string, string>;
        body: ResBody;
        type: string;
    };

    status(status: number): this;
    header(key: string, value: string): this;
    text(text: string): this;
    json(data: unknown): this;
}
