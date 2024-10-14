import { Card } from 'components/card'
import { ReactNode } from 'react'

import { Step } from './step'

type Props = {
  children: ReactNode
  step: {
    description: string
    position: number
  }
} & ({ card?: true; heading: string; subheading: string } | { card: false })

export const Section = ({ children, step, ...props }: Props) => (
  <section className="mt-8 flex flex-col gap-y-6">
    <Step {...step} />
    {props.card !== false ? (
      <Card>
        <div className="flex flex-col gap-y-6 p-4 font-medium md:flex-row md:justify-between md:p-6">
          <div>
            <h3 className="text-base text-neutral-950">{props.heading}</h3>
            <p className="text-ms mt-1 leading-5 text-neutral-600">
              {props.subheading}
            </p>
          </div>
          {children}
        </div>
      </Card>
    ) : (
      children
    )}
  </section>
)