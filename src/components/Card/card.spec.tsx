import * as React from 'react'
import { composeStories } from '@storybook/testing-react'
import { mount } from '@cypress/react'
import * as stories from './card.stories'
import chaiColors from 'chai-colors'
import { colors } from '../../theme'
import { Colors } from '../../theme/styled'

chai.use(chaiColors)

const { Light, Gray, Yellow, Red, Pink } = composeStories(stories)

const theme: Colors = colors(false)

describe('Card and Background Color test', () => {
  it('Verify Light Card, this should work', () => {
    mount(<Light />)

    cy.get('div')
      .contains('Light')
      .should('have.css', 'background-color')
      .and('be.colored', theme.bg1)
  })

  it('Verify Gray Card, this should work', () => {
    mount(<Gray />)

    cy.get('div')
      .contains('Gray')
      .should('have.css', 'background-color')
      .and('be.colored', theme.bg3)
  })

  it('Verify Yellow Card, this should work', () => {
    mount(<Yellow />)

    cy.get('div')
      .contains('Yellow')
      .should('have.css', 'color')
      .and('be.colored', theme.yellow2)
  })

  it('Verify Red Card, this should work', () => {
    mount(<Red />)

    cy.get('div')
      .contains('Red')
      .should('have.css', 'color')
      .and('be.colored', theme.avaxRed)
  })

  it('Verify Pink Card, this should work', () => {
    mount(<Pink />)

    cy.get('div')
      .contains('Pink')
      .should('have.css', 'color')
      .and('be.colored', theme.primary1)
  })
})
