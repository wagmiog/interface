import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Tooltip from '.'

export default {
  component: Tooltip,
  title: 'Base/Tooltip'
} as ComponentMeta<typeof Tooltip>

const Template: ComponentStory<typeof Tooltip> = args => <Tooltip {...args}>Test Tooltip</Tooltip>

export const Default = Template.bind({})
Default.args = {
  show: true,
  text: 'Test Tooltip'
}
