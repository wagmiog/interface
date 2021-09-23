import React from 'react'
import store from '../state'
import '../i18n'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import ThemeProvider, { ThemedGlobalStyle } from '../theme'

// Global decorator to apply the styles to all stories
export const decorators = [
  Story => (
    <>
      <Provider store={store}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <HashRouter>
            <Story />
          </HashRouter>
        </ThemeProvider>
      </Provider>
    </>
  )
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}
