import { ReactNode } from 'react'
import { Card, StepNumber, StepContent, StepTitle, StepCheck } from './StepCard.styled'

interface StepCardProps {
  num: string
  title: string
  done: boolean
  locked: boolean
  children?: ReactNode
}

export default function StepCard({ num, title, done, locked, children }: StepCardProps) {
  return (
    <Card $done={done} $locked={locked}>
      <StepNumber $done={done}>{num}</StepNumber>
      <StepContent>
        <StepTitle>{title}</StepTitle>
        {children}
      </StepContent>
      {done && <StepCheck>✓</StepCheck>}
    </Card>
  )
}
