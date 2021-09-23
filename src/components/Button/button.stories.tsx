import React from 'react'
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonLight,
  ButtonGray,
  ButtonPink,
  ButtonOutlined,
  ButtonWhite,
  ButtonEmpty,
  ButtonConfirmed,
  ButtonError,
  ButtonRadio,
  ButtonDropdown
} from '.'
import { ComponentStory } from '@storybook/react'

export default {
  component: ButtonPrimary,
  title: 'Base/Buttons'
}

export const Primary = () => <ButtonPrimary>Primary</ButtonPrimary>

export const Secondary = () => <ButtonSecondary>Secondary</ButtonSecondary>

export const Light = () => <ButtonLight>Light</ButtonLight>

export const Gray = () => <ButtonGray>Gray</ButtonGray>

export const Pink = () => <ButtonPink>Pink</ButtonPink>

export const Outline = () => <ButtonOutlined>Outline</ButtonOutlined>

export const White = () => <ButtonWhite>White</ButtonWhite>

export const Empty = () => <ButtonEmpty>Empty</ButtonEmpty>

const TemplateConfirmed: ComponentStory<typeof ButtonConfirmed> = (args: any) => (
  <ButtonConfirmed {...args}>Confirmed</ButtonConfirmed>
)

export const Confirmed = TemplateConfirmed.bind({})
Confirmed.args = {
  confirmed: true
}

const TemplateError: ComponentStory<typeof ButtonError> = (args: any) => <ButtonError {...args}>Error</ButtonError>

export const Error = TemplateError.bind({})
Error.args = {
  error: true
}

const TemplateRadioButton: ComponentStory<typeof ButtonRadio> = (args: any) => (
  <ButtonRadio {...args}>Radio</ButtonRadio>
)

export const Radio = TemplateRadioButton.bind({})
Radio.args = {
  active: true
}

export const Dropdown = () => (
  <ButtonDropdown>
    <div>Select Token</div>
  </ButtonDropdown>
)
