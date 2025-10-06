declare module '@lingui/core' {
  export type MessageDescriptor = any
  export const i18n: any
  export function setupI18n(...args: any[]): any
  const core: any
  export default core
}

declare module '@lingui/macro' {
  export const t: any
  export const plural: any
  export const Trans: any
  export const msg: any
  const macro: any
  export default macro
}

declare module '@lingui/react' {
  export const I18nProvider: any
  export const useLingui: any
  const linguiReact: any
  export default linguiReact
}
