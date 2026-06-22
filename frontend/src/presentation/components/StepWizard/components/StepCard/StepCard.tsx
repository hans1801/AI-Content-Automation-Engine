import { ReactNode } from 'react'
import { Card, StepNumber, StepContent, StepTitle, StepCheck, RegenerateBtn } from './StepCard.styled'

interface StepCardProps {
  num: string
  title: string
  done: boolean
  locked: boolean
  onRegenerate?: () => void
  children: ReactNode
}

export default function StepCard({ num, title, done, locked, onRegenerate, children }: StepCardProps) {
  return (
    <Card $done={done} $locked={locked}>
      <StepNumber $done={done}>{num}</StepNumber>
      <StepContent>
        <StepTitle>{title}</StepTitle>
        {children}
      </StepContent>
      {done && onRegenerate && (
        <RegenerateBtn onClick={onRegenerate} title="Regenerar">↺</RegenerateBtn>
      )}
      {done && <StepCheck>✓</StepCheck>}
    </Card>
  )
}
