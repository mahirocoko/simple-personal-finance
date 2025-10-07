import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./app/test/setup.ts'],
		include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/', 'app/test/'],
		},
	},
	resolve: {
		alias: {
			'~': path.resolve(__dirname, './app'),
		},
	},
})
