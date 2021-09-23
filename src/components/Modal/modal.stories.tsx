import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Modal from '.'

export default {
  component: Modal,
  title: 'Base/Modal'
} as ComponentMeta<typeof Modal>

const Template: ComponentStory<typeof Modal> = args => <Modal {...args} />

export const Default = Template.bind({})
Default.args = {
  isOpen: true,
  onDismiss: () => {}
}
