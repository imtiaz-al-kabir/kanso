'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselSlide {
  tagline: string;
  title: string;
  description: string;
  image: string;
  buttonLink: string;
  buttonText: string;
}

const SLIDES: CarouselSlide[] = [
  {
    tagline: 'New Autumn Series',
    title: 'Mindful Spaces, Minimal Beauty.',
    description: 'Organic structures, tactile textures, and soft earthy neutral palettes curated to infuse your modern living with silent, luxury serenity.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=85',
    buttonLink: '/shop?category=furniture',
    buttonText: 'Enter Collection',
  },
  {
    tagline: 'Handcrafted Stoneware',
    title: 'The Art of Slow Rituals.',
    description: 'Everyday items modeled with organic asymmetry. Stoneware teasets and volcanic clay glazed vases celebrating the beauty in natural impermanence.',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1600&q=85',
    buttonLink: '/shop?category=ceramics',
    buttonText: 'Explore Stoneware',
  },
  {
    tagline: 'Mulberry Paper Lanterns',
    title: 'Warm Shadows, Quiet Light.',
    description: 'Cast soft, diffuse glows and organic patterns with structural bamboo ribs. Curated lamps built to frame comfortable ambient space.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=85',
    buttonLink: '/shop?category=lighting',
    buttonText: 'View Lighting',
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export default function HomeHeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [handleNext, isHovered]);

  // Motion slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <section 
      className="relative w-full h-[70vh] md:h-[80vh] rounded-3xl overflow-hidden shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Carousel Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.01]"
            style={{
              backgroundImage: `url('${currentSlide.image}')`,
            }}
          />
        </AnimatePresence>
      </div>

      {/* Shadow Vignette & Ambient Layer */}
      <div className="absolute inset-0 bg-charcoal/25 backdrop-brightness-[0.8] vignette-bottom z-10" />

      {/* Content Area */}
      <div className="absolute bottom-12 md:bottom-20 left-6 md:left-12 max-w-xl text-sand flex flex-col gap-5 z-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5"
          >
            <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-primary">
              {currentSlide.tagline}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-light leading-[1.1] tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="font-sans text-xs md:text-sm font-light text-stone-300 leading-relaxed max-w-md">
              {currentSlide.description}
            </p>
            <div className="pt-2">
              <Link
                href={currentSlide.buttonLink}
                className="inline-flex items-center gap-3 bg-sand text-charcoal px-8 py-4 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-stone-200 transition-all duration-300 group shadow-lg active:scale-97 cursor-pointer"
              >
                {currentSlide.buttonText}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border border-sand/20 bg-charcoal/10 hover:bg-charcoal/30 backdrop-blur-md flex items-center justify-center text-sand transition-all hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full border border-sand/20 bg-charcoal/10 hover:bg-charcoal/30 backdrop-blur-md flex items-center justify-center text-sand transition-all hover:scale-105 active:scale-95 pointer-events-auto cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators / Line Progress Dots */}
      <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-2.5 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="group flex items-center justify-center p-2 cursor-pointer"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div 
              className={`h-0.5 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'w-8 bg-sand' 
                  : 'w-3.5 bg-sand/40 group-hover:bg-sand/75'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
