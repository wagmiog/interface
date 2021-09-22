import * as React from 'react'
import { composeStories } from '@storybook/testing-react'
import { mount } from '@cypress/react'
import * as stories from './button.stories'

// compile the "Primary"  button story
const { Primary } = composeStories(stories)

it('Button', () => {
  mount(<Primary />)
  cy.get('button')
    .contains('Primary')
    .click()
})
