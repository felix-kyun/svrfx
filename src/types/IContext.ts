export interface IContext {
    env: Record<string, string>;
    req: IRequest;
    res: IResponse;

    status(status: number): void;
    header(key: string, value: string): void;
}

export interface IRequest<T = unknown> {
    method: string;
    path: string;
    headers: Record<string, string>;
    params: Record<string, string>;
    query: Record<string, string>;
    body: T;
    ip: string | undefined;
}

export interface IResponse<T = unknown> {
    status: number;
    headers: Record<string, string>;
    body: T | undefined;
    type: string;
}
