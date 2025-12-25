import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  tr: {
    common: {
      topbar: {
        close: 'Kapat',
        minimize: 'Minimize',
        maximize: 'Maximize',
      },
      poweroff: {
        message: 'Açmak için tıklayın',
      },
    },
  },
  en: {
    common: {
      topbar: {
        close: 'Close',
        minimize: 'Minimize',
        maximize: 'Maximize',
      },
      poweroff: {
        message: 'Click to power on',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
