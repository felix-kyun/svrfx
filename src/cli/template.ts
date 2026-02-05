import type { IFn } from "@/types/IFn";

export function template(fn: IFn): string {
    return `// ${fn.name}: ${fn.method.toUpperCase()} ${fn.route}
export async function handler(ctx) {

}
`;
}
