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

export default function Home() {
  return (
    <>
      <div className="absolute left-0 right-0 top-6 z-[100] flex justify-center">
        <Navbar />
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
    </>
    
  );
}
