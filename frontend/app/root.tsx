import { I18nProvider } from '@lingui/react'
import { useLingui } from '@lingui/react/macro'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from 'react-router'
import { LocaleSwitcher } from './components/ui/locale-switcher'
import { ThemeProvider } from './components/theme-provider'
import { useLocaleSync } from './hooks/use-locale-sync'
import { i18n } from './lib/i18n'

import type { Route } from './+types/root'
import './app.css'

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
]

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

function AppContent() {
	const { t } = useLingui()

	// Sync locale changes across browser tabs
	useLocaleSync()

	return (
		<div>
			{/* Navigation */}
			<nav className="bg-primary text-primary-foreground p-4 shadow-md">
				<div className="container mx-auto flex gap-6 items-center">
					<a href="/" className="text-xl font-bold">
						💰 {t`Personal Finance`}
					</a>
					<a href="/" className="hover:underline">
						{t`Dashboard`}
					</a>
					<a href="/transactions" className="hover:underline">
						{t`Transactions`}
					</a>
					<a href="/goals" className="hover:underline">
						{t`Savings Goals`}
					</a>
					<div className="ml-auto">
						<LocaleSwitcher />
					</div>
				</div>
			</nav>

			{/* Main content */}
			<main className="min-h-screen bg-background py-4">
				<Outlet />
			</main>
		</div>
	)
}

export default function App() {
	return (
		<I18nProvider i18n={i18n}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem={true}
				disableTransitionOnChange={false}
			>
				<AppContent />
			</ThemeProvider>
		</I18nProvider>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error'
		details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
