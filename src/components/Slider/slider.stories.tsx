import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Slider from '.'

export default {
  component: Slider,
  title: 'Base/Slider'
} as ComponentMeta<typeof Slider>

const Template: ComponentStory<typeof Slider> = args => <Slider {...args} />

export const Default = Template.bind({})
Default.args = {
  value: 5,
  onChange: () => {}
}
