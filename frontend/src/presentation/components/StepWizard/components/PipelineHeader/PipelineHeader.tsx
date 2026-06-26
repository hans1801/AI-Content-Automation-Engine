import React from 'react'
import { Header, StepItem, Connector, Circle, StepLabel } from './PipelineHeader.styled'

export interface PipelineStep {
  num: string
  title: string
}

type StepStatus = 'done' | 'active' | 'running' | 'locked'

interface Props {
  steps: PipelineStep[]
  selected: number
  getStatus: (i: number) => StepStatus
  onSelect: (i: number) => void
}

export default function PipelineHeader({ steps, selected, getStatus, onSelect }: Props) {
  return (
    <Header>
      {steps.map((step, i) => {
        const status = getStatus(i)
        const locked = status === 'locked'
        return (
          <React.Fragment key={step.num}>
            <StepItem>
              <Circle
                $status={status}
                $selected={i === selected}
                onClick={() => !locked && onSelect(i)}
                disabled={locked}
                aria-label={`Paso ${step.num}: ${step.title}`}
              >
                {status === 'done' ? '✓' : step.num}
              </Circle>
              <StepLabel $selected={i === selected} $locked={locked} $done={status === 'done'}>
                {step.title}
              </StepLabel>
            </StepItem>
            {i < steps.length - 1 && (
              <Connector $filled={status === 'done'} />
            )}
          </React.Fragment>
        )
      })}
    </Header>
  )
}
