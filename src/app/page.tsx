'use client'

import Navbar from '../components/ui/Navbar'
import FeaturesSection from '../components/common/FeaturesSection'
import HeroSection from '@/components/common/HeroSection';
import BrandSection from '@/components/common/BrandSection';
import CapabilitiesSection from '@/components/common/CapabilitiesSection';
import DifferentiatorsSection from '@/components/common/DifferentiatorsSection';
import OutcomesSection from '@/components/common/OutcomesSection';
import SectionDivider from '@/components/ui/SectionDivider';
import FAQSection from '@/components/common/FAQSection';
import HRLeadersSection from '@/components/common/HRLeadersSection';
import HowItWorksSection from '@/components/common/HowItWorksSection';
import Footer from '@/components/common/Footer';
import Dock from '@/components/ui/Dock'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <div className="absolute left-0 right-0 top-6 z-[200] flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full flex justify-center">
          <Navbar />
        </div>
      </div>
      <HeroSection/>
      <SectionDivider />
      <FeaturesSection/>
      <SectionDivider />
      <BrandSection/>
      <SectionDivider />
      <CapabilitiesSection/>
      <SectionDivider />
      <DifferentiatorsSection/>
      <SectionDivider />
      <HRLeadersSection />
      <SectionDivider />
      <HowItWorksSection />
      <SectionDivider />
      <OutcomesSection />
      <SectionDivider />
      <FAQSection />
      <br/>
      <SectionDivider />
      <Footer />

      {/* Mobile dock - visible only on small screens */}
      <div className="fixed inset-x-0 bottom-0 z-[120] sm:hidden">
        <div className="relative">
          <Dock
            className="bg-transparent"
            baseItemSize={30}
            magnification={56}
            dockHeight={30}
            panelHeight={50}
            items={[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l9-8 9 8" />
                    <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
                  </svg>
                ),
                label: 'Home',
                onClick: () => router.push('/'),
                className: 'text-white/80'
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                ),
                label: 'Jobs',
                onClick: () => router.push('/jobs'),
                className: 'text-white/80'
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="3" />
                  </svg>
                ),
                label: 'Login',
                onClick: () => router.push('/login'),
                className: 'text-white/80'
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/90" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .67.39 1.27 1 1.51H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                ),
                label: 'Settings',
                onClick: () => router.push('/'),
                className: 'text-white/80'
              }
            ]}
          />
        </div>
      </div>
    </>
    
  );
}
