import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AutoColumn } from '.'

export default {
  component: AutoColumn,
  title: 'Base/Columns'
} as ComponentMeta<typeof AutoColumn>

const Template: ComponentStory<typeof AutoColumn> = args => <AutoColumn {...args}>Column </AutoColumn>

export const Auto = Template.bind({})
Auto.args = {
  gap: 'sm',
  justify: 'start'
}
