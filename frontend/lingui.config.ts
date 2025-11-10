const config = {
  locales: ['en', 'th'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}/messages',
      include: ['app'],
    },
  ],
  format: 'po',
  compileNamespace: 'es',
}

export default config
