import { useLingui } from '@lingui/react/macro'
import { i18n, locales } from '~/lib/i18n'

export function LocaleSwitcher() {
  const { t } = useLingui()

  const changeLanguage = (locale: string) => {
    i18n.activate(locale)
    localStorage.setItem('locale', locale)
  }

  return (
    <select
      value={i18n.locale}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border rounded px-3 py-1 bg-white"
      aria-label={t`Select language`}
    >
      {Object.entries(locales).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  )
}
