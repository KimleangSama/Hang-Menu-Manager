import { createContext, useContext, useState } from 'react'
import { IntlProvider } from 'use-intl'
import i18n from '../i18n'

export type Language = 'en' | 'km'

type LanguageProviderProps = {
    children: React.ReactNode
    defaultLanguage?: Language
    storageKey?: string
}

type LanguageProviderState = {
    language: Language
    setLanguage: (lang: Language) => void
}

const initialState: LanguageProviderState = {
    language: 'en',
    setLanguage: () => null
}

const LanguageProviderContext =
    createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
    children,
    defaultLanguage = 'en',
    storageKey = 'language',
    ...props
}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(
        () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
    )

    const value = {
        language,
        setLanguage: (lang: Language) => {
            localStorage.setItem(storageKey, lang)
            setLanguage(lang)
        }
    }

    return (
        <LanguageProviderContext.Provider {...props} value={value} >
            <IntlProvider locale={language} messages={i18n[language]} >
                {children}
            </IntlProvider>
        </LanguageProviderContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageProviderContext)

    if (context === undefined)
        throw new Error('useLanguage must be used within a LanguageProvider')

    return context
}