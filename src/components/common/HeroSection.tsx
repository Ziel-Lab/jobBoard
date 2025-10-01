import React from 'react'
import LightRays from '../ui/LightRays'



const HeroSection = () => {
  return (
    <>
        <div className="relative w-full min-h-[100dvh] overflow-hidden px-4 sm:px-6">
      
      <LightRays
        className="absolute inset-0 z-0"
        raysOrigin="top-center"
        raysColor="#FFFFFF"
        raysSpeed={1.7}
        lightSpread={1.0}
        rayLength={6.5}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.0}
        distortion={0.1}
        saturation={0.5}
      />
      
      <div className="absolute inset-0 z-[100] flex flex-col gap-4 items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">AI-Assisted Hiring.
          <br />Better Matches, Faster Offers</h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">Hire top talent faster, smarter, and more transparently avoiding inbox floods with our AI-powered platform.</p>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <button
            className="rounded-full px-6 py-3 text-sm font-semibold text-neutral-900 border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.78))] hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Get Started
          </button>
          <button
            className="rounded-full px-6 py-3 text-sm font-semibold text-white/90 border border-white/25 bg-white/5 hover:bg-white/10 backdrop-blur-md"
          >
            Watch Demo
          </button>
        </div>
      </div>
      
      {/* <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_70%)] pointer-events-none" /> */}
      
    </div>
    </>
  )
}

export default HeroSection