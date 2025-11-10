import { lingui } from '@lingui/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [reactRouter(), tailwindcss(), tsconfigPaths(), lingui(), macrosPlugin()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
			},
		},
	},
})
