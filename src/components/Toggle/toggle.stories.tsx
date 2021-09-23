import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Toggle from '.'

export default {
  component: Toggle,
  title: 'Base/Toggle'
} as ComponentMeta<typeof Toggle>

const Template: ComponentStory<typeof Toggle> = args => <Toggle {...args}></Toggle>

export const Default = Template.bind({})
Default.args = {
  isActive: true,
  toggle: () => {}
}
