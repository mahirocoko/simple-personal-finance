export namespace Route {
  export interface MetaArgs {
    params: Record<string, string>
    data: unknown
    matches: unknown[]
  }
}
