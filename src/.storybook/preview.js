import React from 'react'
import store from '../state'
import { Provider } from 'react-redux'
import ThemeProvider, { ThemedGlobalStyle } from '../theme'

// Global decorator to apply the styles to all stories
export const decorators = [
  Story => (
    <>
      <Provider store={store}>
        <ThemeProvider>
          <ThemedGlobalStyle />
          <Story />
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
