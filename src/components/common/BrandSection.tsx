import React from 'react'
import LogoLoop from '../ui/LogoLoop'
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';


const techLogos = [
    { node: <SiReact />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  ];
  
  // Alternative with image sources
//   const imageLogos = [
//     { src: "/logos/company1.png", alt: "Company 1", href: "https://company1.com" },
//     { src: "/logos/company2.png", alt: "Company 2", href: "https://company2.com" },
//     { src: "/logos/company3.png", alt: "Company 3", href: "https://company3.com" },
//   ];

const BrandSection = () => {
  return (
    <section aria-labelledby='partners-title' className='max-w-7xl mx-auto mt-10 lg:mt-28 px-4'>
        
      <p id='partners-title' className='w-full mx-auto text-center mb-10 text-lg sm:text-xl text-white/80 max-w-3xl leading-relaxed'>
        
        Trusted by fast-growing teams across SaaS, ecommerce, and services.
      </p>
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
        <LogoLoop
          logos={techLogos}
          speed={90}
          direction="left"
          logoHeight={80}
          gap={60}
          pauseOnHover
          scaleOnHover
          fadeOut
          fadeOutColor="#00000"
          ariaLabel="Technology partners"
        />
      </div>
    </section>
  )
}

export default BrandSection