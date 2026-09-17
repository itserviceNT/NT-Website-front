import 'server-only'

import type { Locale } from './config'
import en from './dictionaries/en.json'
import ru from './dictionaries/ru.json'

export type Dictionary = typeof en

const dictionaries: Record<Locale, Dictionary> = { en, ru: ru as Dictionary }

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
