import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import ProgressSteps from '.'

export default {
  component: ProgressSteps,
  title: 'Base/ProgressSteps'
} as ComponentMeta<typeof ProgressSteps>

const Template: ComponentStory<typeof ProgressSteps> = args => <ProgressSteps {...args} />

export const Default = Template.bind({})
Default.args = {
  steps: [true, true, false]
}
