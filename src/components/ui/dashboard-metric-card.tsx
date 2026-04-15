'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

type IconType = React.ElementType

export type TrendType = 'up' | 'down' | 'neutral'

export interface DashboardMetricCardProps {
  value: string
  title: string
  icon?: IconType
  trendChange?: string
  trendType?: TrendType
  className?: string
  children?: React.ReactNode
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  value,
  title,
  icon: IconComponent,
  trendChange,
  trendType = 'neutral',
  className,
  children,
}) => {
  const TrendIcon = trendType === 'up' ? ArrowUp : trendType === 'down' ? ArrowDown : Minus
  const trendColorClass =
    trendType === 'up'
      ? 'text-emerald-600'
      : trendType === 'down'
      ? 'text-red-500'
      : 'text-zinc-400'

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px -6px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn('cursor-pointer rounded-2xl h-full', className)}
    >
      <Card className="h-full border-zinc-800 bg-zinc-900 transition-colors rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">
            {title}
          </CardTitle>
          {IconComponent && (
            <IconComponent className="h-4 w-4 text-zinc-300" aria-hidden="true" />
          )}
        </CardHeader>
        <CardContent>
          {children ? (
            children
          ) : (
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{value}</div>
          )}
          {trendChange && (
            <p className={cn('flex items-center text-xs font-medium mt-2', trendColorClass)}>
              <TrendIcon className="h-3 w-3 mr-1" aria-hidden="true" />
              {trendChange}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default DashboardMetricCard
