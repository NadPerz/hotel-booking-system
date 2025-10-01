'use client'

import React from 'react'
import { Star, StarHalf, StarOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingBarProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  readOnly?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
  showValue?: boolean
  decimalPrecision?: number
}

const RatingBar: React.FC<RatingBarProps> = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  readOnly = false,
  onRatingChange,
  className,
  showValue = false,
  decimalPrecision = 1
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const starSize = sizeClasses[size]
  const roundedRating = parseFloat(rating.toFixed(decimalPrecision))

  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(roundedRating)
    const hasDecimal = roundedRating % 1 !== 0
    const decimalStars = hasDecimal ? 1 : 0

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <button
          key={`full-${i}`}
          type="button"
          onClick={() => !readOnly && onRatingChange?.(i + 1)}
          className={cn(
            'text-yellow-400 fill-current',
            !readOnly && 'hover:text-yellow-500 cursor-pointer',
            readOnly && 'cursor-default',
            starSize
          )}
          disabled={readOnly}
          aria-label={`Star ${i + 1}`}
        >
          <Star />
        </button>
      )
    }

    // Decimal star (half star)
    if (hasDecimal) {
      stars.push(
        <button
          key="decimal"
          type="button"
          onClick={() => !readOnly && onRatingChange?.(Math.ceil(roundedRating))}
          className={cn(
            'text-yellow-400 fill-current',
            !readOnly && 'hover:text-yellow-500 cursor-pointer',
            readOnly && 'cursor-default',
            starSize
          )}
          disabled={readOnly}
          aria-label="Half star"
        >
          <StarHalf />
        </button>
      )
    }

    // Empty stars
    const emptyStars = maxStars - fullStars - decimalStars
    for (let i = 0; i < emptyStars; i++) {
      const starIndex = fullStars + decimalStars + i + 1
      stars.push(
        <button
          key={`empty-${i}`}
          type="button"
          onClick={() => !readOnly && onRatingChange?.(starIndex)}
          className={cn(
            'text-gray-300',
            !readOnly && 'hover:text-yellow-400 cursor-pointer',
            readOnly && 'cursor-default',
            starSize
          )}
          disabled={readOnly}
          aria-label={`Empty star ${starIndex}`}
        >
          <StarOff />
        </button>
      )
    }

    return stars
  }

 return (
  <div className={cn('flex items-center gap-4', className)}> {/* spacing between stars & text */}
    <div className="flex items-center space-x-4"> {/* bigger gap between stars */}
      {renderStars()}
    </div>
    
    {showValue && (
      <span className="text-sm text-muted-foreground ml-4">
        {roundedRating}/{maxStars}
      </span>
    )}
  </div>
)
}

export { RatingBar }
