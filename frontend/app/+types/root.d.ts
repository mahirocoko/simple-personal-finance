export namespace Route {
  export type LinksFunction = () => Array<Record<string, unknown>>
  export interface MetaArgs {
    params: Record<string, string>
    data: unknown
    matches: unknown[]
  }
  export interface ErrorBoundaryProps {
    error: unknown
  }
}
