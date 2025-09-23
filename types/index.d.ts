export declare class Route {
  constructor(route: string);
  match(path: string): Record<string, string> | false;
  reverse(params: Record<string, string>): string;
  generate(
    generators: Array<{ match: RegExp; generate: () => string }>
  ): string;
  readonly spec: string;
}
