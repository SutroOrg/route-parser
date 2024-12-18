export declare class Route {
    constructor(route: string);
    match(path: string): Record<string, string> | null;
    reverse(params: Record<string, string>): string;
}