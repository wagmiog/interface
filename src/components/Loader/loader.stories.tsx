import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Loader from '.'

export default {
  component: Loader,
  title: 'Base/Loader',
  argTypes: {
    stroke: { control: 'color' }
  }
} as ComponentMeta<typeof Loader>

const Template: ComponentStory<typeof Loader> = args => <Loader {...args} />

export const Default = Template.bind({})
Default.args = {
  size: '16px'
}
