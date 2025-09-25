'use client'

import React, { useState } from 'react'
import { RatingBar } from '@/components/ui/RatingBar'
import { MoreVertical as FaEllipsisV } from 'lucide-react'

interface ReviewCardProps {
  reviewerName: string
  reviewerAvatar?: string
  rating: number
  reviewText: string
  onReport: () => void
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  reviewerAvatar,
  rating,
  reviewText,
  onReport,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4 transition-shadow hover:shadow-lg">
      {/* Top section: reviewer info + 3-dot menu */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
            {reviewerAvatar ? (
              <img
                src={reviewerAvatar}
                alt={reviewerName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              reviewerName.charAt(0).toUpperCase()
            )}
          </div>

          {/* Name + Rating */}
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{reviewerName}</h4>
            <RatingBar
              rating={rating}
              maxStars={5}
              size="sm"
              readOnly
              showValue={false}
              className="text-yellow-500"
            />
          </div>
        </div>

        {/* 3-dot menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FaEllipsisV className="text-gray-500" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                onClick={onReport}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Report Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm mt-3">{reviewText}</p>
    </div>
  )
}

// Optional: wrap multiple reviews in a common section
export const ReviewsSection: React.FC<{ reviews: ReviewCardProps[] }> = ({ reviews }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md space-y-4">
      {reviews.map((review, idx) => (
        <ReviewCard key={idx} {...review} />
      ))}
    </div>
  )
}

export default ReviewCard
