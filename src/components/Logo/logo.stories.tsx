import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Logo from '.'

export default {
  component: Logo,
  title: 'Base/Logo'
} as ComponentMeta<typeof Logo>

const Template: ComponentStory<typeof Logo> = args => <Logo {...args}>Column </Logo>

export const LogoC = Template.bind({})
LogoC.args = {
  srcs: [],
  alt:'logo'
}
