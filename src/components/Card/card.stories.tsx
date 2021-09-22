import React from 'react'
import { GreyCard, LightCard, OutlineCard, YellowCard, RedCard, PinkCard, BlueCard } from '.'
import Card from '.'

export default {
  component: Card,
  title: 'Base/Cards'
}

export const Default = () => <Card>Default</Card>

export const Light = () => <LightCard>Light</LightCard>

export const Gray = () => <GreyCard>Gray</GreyCard>

export const Yellow = () => <YellowCard>Yellow</YellowCard>

export const Outline = () => <OutlineCard>Outline</OutlineCard>

export const Red = () => <RedCard>White</RedCard>

export const Pink = () => <PinkCard>Empty</PinkCard>

export const Blue = () => <BlueCard>Blue</BlueCard>
