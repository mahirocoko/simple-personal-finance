import type { LinguiConfig } from '@lingui/conf'

const config: LinguiConfig = {
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
