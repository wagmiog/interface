import React from 'react'
import { ComponentStory } from '@storybook/react'
import { AutoRow, RowFixed } from '.'

export default {
  component: AutoRow,
  title: 'Base/Rows'
}

const AutoRowTemplate: ComponentStory<typeof AutoRow> = args => <AutoRow {...args}>Column </AutoRow>

export const Auto = AutoRowTemplate.bind({})
Auto.args = {
  gap: 'sm',
  justify: 'start'
}

const RowFixedTemplate: ComponentStory<typeof RowFixed> = args => <RowFixed {...args}>Column </RowFixed>

export const Fixed = RowFixedTemplate.bind({})
Fixed.args = {
  gap: 'sm',
  justify: 'start'
}
