import * as React from 'react'
import { composeStories } from '@storybook/testing-react'
import { mount } from '@cypress/react'
import * as stories from './button.stories'
import chaiColors from 'chai-colors'
import { colors } from '../../theme'
import { Colors } from '../../theme/styled'
import { lighten } from 'polished'

chai.use(chaiColors)

const { Primary, Confirmed, Gray, Outline, Empty, Error, Radio, White } = composeStories(stories)

const theme: Colors = colors(false)

describe('Button and Background Color test', () => {
  it('Verify Primary Button and backgroud color, this should work', () => {
    mount(<Primary />)

    cy.get('button')
      .contains('Primary')
      .should('have.css', 'background-color')
      .and('be.colored', theme.primary1)
  })

  it('Verify Confirmed Button and backgroud color, this should work', () => {
    mount(<Confirmed />)
    cy.get('button')
      .contains('Confirmed')
      .should('have.css', 'background-color')
      .and('be.colored', lighten(0.5, theme.green1))
  })

  it('Verify Gray Button and backgroud color, this should work', () => {
    mount(<Gray />)
    cy.get('button')
      .contains('Gray')
      .should('have.css', 'background-color')
      .and('be.colored', theme.bg3)
  })

  it('Verify White Button and backgroud color, this should work', () => {
    mount(<White />)
    cy.get('button')
      .contains('White')
      .should('have.css', 'background-color')
      .and('be.colored', theme.bg1)
  })

  it('Verify Outline Button and color, this should work', () => {
    mount(<Outline />)
    cy.get('button')
      .contains('Outline')
      .should('have.css', 'color')
      .and('be.colored', theme.text1)
  })

  it('Verify Empty Button this should work', () => {
    mount(<Empty />)
    cy.get('button')
      .contains('Empty')
      .should('have.css', 'color')
      .and('be.colored', theme.primary1)
  })

  it('Verify Error Button and backgroud color, this should work', () => {
    mount(<Error />)
    cy.get('button')
      .contains('Error')
      .should('have.css', 'background-color')
      .and('be.colored', theme.red1)
  })

  it('Verify Active Radio Button and backgroud color, this should work', () => {
    mount(<Radio active />)
    cy.get('button')
      .contains('Radio')
      .should('have.css', 'background-color')
      .and('be.colored', theme.primary1)
  })
})
