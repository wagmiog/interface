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

export const Confirmed = () => <ButtonConfirmed confirmed>Confirmed</ButtonConfirmed>

export const Error = () => <ButtonError error>Error</ButtonError>

export const Radio = () => <ButtonRadio active>Radio</ButtonRadio>

export const Dropdown = () => (
  <ButtonDropdown>
    <div>Select Token</div>
  </ButtonDropdown>
)
