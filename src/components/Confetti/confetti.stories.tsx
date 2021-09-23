import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Confetti from '.'

export default {
  component: Confetti,
  title: 'Base/Confetti'
} as ComponentMeta<typeof Confetti>

const Template: ComponentStory<typeof Confetti> = args => <Confetti {...args} />

export const Default = Template.bind({})
Default.args = {
  start: true
}
