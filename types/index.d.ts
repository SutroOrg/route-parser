export declare class Route {
  constructor(route: string);
  match(path: string): Record<string, string> | false;
  reverse(params: Record<string, string>): string;
  readonly spec: string;
}
