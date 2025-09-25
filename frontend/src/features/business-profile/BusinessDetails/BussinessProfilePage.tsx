'use client'

import React, { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { RatingBar } from "@/components/ui/RatingBar"
import ReviewCard from "./reviewCard"
import { FeedPage } from '../BusinessDetails/postSection/feedPage';

interface Slide {
  id: number
  image: string
  caption: string
}

type Review = {
  reviewerName: string
  reviewerAvatar?: string
  rating: number
  reviewText: string
}

interface ReviewsContainerProps {
  reviews: Review[]
}

// Dummy slides for now (will be replaced by backend later)
const dummySlides: Slide[] = [
  { id: 1, image: "https://s3-media0.fl.yelpcdn.com/bphoto/pvfBHh-Wdh11EgXv_H7ZCw/o.jpg", caption: "Plan your perfect trip" },
  { id: 2, image: "https://s3-media0.fl.yelpcdn.com/bphoto/LJ4yYr1OZmbp-_uvoXo9TA/o.jpg", caption: "Discover amazing places" },
  { id: 3, image: "https://s3-media0.fl.yelpcdn.com/bphoto/zmnYfXVxAXA4UZ0HH2NsZQ/o.jpg", caption: "Book with ease" },
]

const BusinessProfilePage: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)

  // Business data (dummy for now, will be fetched from backend)
  const [businessName, setBusinessName] = useState("Sample Business")
  const [restaurantType, setRestaurantType] = useState("Italian Restaurant")
  const [reviewsCount, setReviewsCount] = useState(120)

  // Initialize slides (dummy for now)
  useEffect(() => {
    setSlides(dummySlides)
  }, [])

  // Auto-slide effect
  useEffect(() => {
    if (!slides.length) return
    const interval = setInterval(() => {
      setCurrent((prev: number) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [slides])

  // Navigation functions
  const goNext = () => {
    setCurrent((prev: number) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    setCurrent((prev: number) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrent(index)
  }

  // Dummy review data
  const dummyReviews = [
    { reviewerName: "John Doe", rating: 5, reviewText: "Amazing experience!", reviewerAvatar: "" },
    { reviewerName: "Jane Smith", rating: 4, reviewText: "Really enjoyed the food.", reviewerAvatar: "" },
    { reviewerName: "Alice Johnson", rating: 4.5, reviewText: "Highly recommend!", reviewerAvatar: "" },
  ]

  const ReviewsContainer: React.FC<ReviewsContainerProps> = ({ reviews }) => {
    // Limit to top 10 reviews
    const topReviews = reviews.slice(0, 10)

    return (
      <div className="flex-1 max-h-[600px] overflow-y-auto pr-2">
        {topReviews.map((review: Review, idx: number) => (
          <ReviewCard
            key={idx}
            reviewerName={review.reviewerName}
            reviewerAvatar={review.reviewerAvatar}
            rating={review.rating}
            reviewText={review.reviewText}
            onReport={() => alert(`Reported review by ${review.reviewerName}`)}
          />
        ))}
        {topReviews.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-4">No reviews yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Menu */}
      <header className="border-b bg-card/90 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-foreground font-bold">AI</span>
            </div>
            <h1 className="text-lg font-semibold text-foreground tracking-wide">
              Travel Planner
            </h1>
          </div>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6 text-sm font-medium">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="transition-colors hover:text-primary"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/bookings"
                  className="transition-colors hover:text-primary"
                >
                  Bookings
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/about"
                  className="transition-colors hover:text-primary"
                >
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/signin"
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                >
                  Sign In
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </div>
      </header>

      {/* Slideshow Section (aligned right below navbar) */}
      <section className="relative w-full h-[400px] mt-0">
        {slides.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            Loading slides...
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            {/* Slides */}
            {slides.map((slide: Slide, index: number) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === current ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                />

                {/* Caption (bottom-left small text) */}
                <div className="absolute bottom-6 left-6 bg-black/50 text-white px-4 py-2 rounded-lg text-sm z-10">
                  {slide.caption}
                </div>
              </div>
            ))}

            {/* === Overlayed Business Name Container (always on top) === */}
            <div className="absolute inset-y-0 left-0 w-1/4 flex flex-col items-center justify-center bg-white/20 backdrop-blur-md z-20 px-2 py-4">
              {/* Business Name */}
              <h2 className="text-2xl font-bold text-white text-center drop-shadow-lg mb-1">
                {businessName} {/* fetched from backend */}
              </h2>

              {/* Restaurant Type */}
              <p className="text-sm text-white/90 mb-2">
                {restaurantType} {/* e.g., "Italian Restaurant" */}
              </p>

              {/* Rating + Reviews */}
              <div className="flex items-center space-x-2">
                <RatingBar
                  rating={4.5}
                  maxStars={5}
                  size="sm"
                  readOnly
                  showValue
                  className="text-white"
                />
                <span className="text-sm text-white/90">
                  ({reviewsCount}) {/* e.g., (120 reviews) */}
                </span>
              </div>
            </div>
            {/* Left / Right Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center z-30"
            >
              &#10094;
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center z-30"
            >
              &#10095;
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 w-full flex justify-center space-x-2 z-30">
              {slides.map((_: Slide, index: number) => (
                <span
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${index === current ? "bg-primary scale-125" : "bg-white/60"
                    }`}
                ></span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Buttons Section */}
      <section className="container mx-auto px-4 mt-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <button className="flex items-center justify-center w-2/5 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </button>

          <button className="flex items-center justify-center w-3/5 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors">
            Add Review
          </button>
        </div>
      </section>
      <section className="container mx-auto px-4 mt-6 flex gap-6">
        {/* Rating Overview Card */}
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Rating Overview
          </h3>

          {/* Example: Overall Rating */}
          <div className="flex items-center mb-4 justify-center">
            <RatingBar
              rating={4.5}
              maxStars={5}
              size="md"
              readOnly
              showValue
              className="text-yellow-500"
            />
            <span className="ml-2 text-gray-700 text-sm">(120 reviews)</span>
          </div>

          {/* Example: Rating Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = { 5: 80, 4: 25, 3: 10, 2: 3, 1: 2 }[star] ?? 0
              const percentage = (count / 120) * 100
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-4 text-sm">{star}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right text-sm text-gray-600">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reviews Container */}
        <div className="flex-1">
          <ReviewsContainer reviews={dummyReviews} />
        </div>
      </section>

      <section className="container mx-auto px-4 mt-10 flex justify-start">
        <div className="w-full max-w-2xl">
          <FeedPage />
        </div>
      </section>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome to Business Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your bookings, view analytics, and customize your travel business profile here.
        </p>
      </main>
    </div>
  )
}

export default BusinessProfilePage
