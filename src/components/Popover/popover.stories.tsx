import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Popover from '.'

export default {
  component: Popover,
  title: 'Base/Popover'
} as ComponentMeta<typeof Popover>

const Template: ComponentStory<typeof Popover> = args => <Popover {...args}> Test Div</Popover>

export const Default = Template.bind({})
Default.args = {
  content: 'test',
  show: true,
  children: () => {
    return <div>Test2</div>
  }
}
