'use client'

import React, { useState, useEffect } from "react"

interface Slide {
  id: number
  image: string
  caption: string
}

const dummySlides: Slide[] = [
  { id: 1, image: "https://s3-media0.fl.yelpcdn.com/bphoto/pvfBHh-Wdh11EgXv_H7ZCw/o.jpg", caption: "Plan your perfect trip" },
  { id: 2, image: "https://s3-media0.fl.yelpcdn.com/bphoto/LJ4yYr1OZmbp-_uvoXo9TA/o.jpg", caption: "Discover amazing places" },
  { id: 3, image: "https://s3-media0.fl.yelpcdn.com/bphoto/zmnYfXVxAXA4UZ0HH2NsZQ/o.jpg", caption: "Book with ease" },
]

interface BusinessProfileSlideshowProps {
  businessName?: string
  slides?: Slide[]
}

const BusinessProfileSlideshow: React.FC<BusinessProfileSlideshowProps> = ({ 
  businessName = "Business Name", 
  slides: propSlides 
}) => {
  const [internalSlides, setInternalSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)

  // Use provided slides or dummy slides
  useEffect(() => {
    const slidesToUse = propSlides && propSlides.length > 0 ? propSlides : dummySlides
    setInternalSlides(slidesToUse)
  }, [propSlides])

  // Auto-slide effect
  useEffect(() => {
    if (!internalSlides.length) return
    const interval = setInterval(() => {
      setCurrent((prev: number) => (prev + 1) % internalSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [internalSlides])

  const goPrev = () => setCurrent((prev: number) => (prev - 1 + internalSlides.length) % internalSlides.length)
  const goNext = () => setCurrent((prev: number) => (prev + 1) % internalSlides.length)
  const goToSlide = (index: number) => setCurrent(index)

  if (!internalSlides.length) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
        Loading slides...
      </div>
    )
  }

  return (
    <section className="relative w-full h-[400px]">
      <div className="relative w-full h-full overflow-hidden">
        {/* Slides (fade effect) */}
        {internalSlides.map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              className="w-full h-full object-cover"
            />

            {/* Caption */}
            <div className="absolute bottom-6 left-6 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-10">
              {slide.caption}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BusinessProfileSlideshow
