import { DecisionPreset } from '../types';

export const DECISION_PRESETS: DecisionPreset[] = [
  {
    id: 'job-offer',
    title: 'Senior Dev: Series A Startup vs Established Tech Enterprise',
    icon: 'Briefcase',
    category: 'Career & Work',
    dilemma: 'I have two compelling job offers and must decide by end of week.',
    options: [
      'Series A AI Startup: $165k base, 0.4% equity, rapid pace, in-person 3 days/wk, high autonomy',
      'Established Public Tech: $195k base, $40k RSU/yr, fully remote, structured hierarchy, slower velocity'
    ],
    priorities: 'Career acceleration, learning curve, compensation potential, work-life balance with young family'
  },
  {
    id: 'housing-rent-buy',
    title: 'Rent vs Buy: 3-Bedroom Home in the Suburbs',
    icon: 'Home',
    category: 'Finance & Housing',
    dilemma: 'Should we continue renting our apartment ($2,600/mo) or buy a house ($580k purchase, ~6.8% mortgage)?',
    options: [
      'Buy Single Family Home: $580k, $80k down payment, building equity, maintenance responsibility, 5+ yr horizon',
      'Continue Renting & Invest: $2,600/mo rent, invest $80k savings in low-cost index funds, maximum flexibility'
    ],
    priorities: 'Long-term wealth creation, family stability, liquidity for emergencies, peace of mind'
  },
  {
    id: 'tech-stack',
    title: 'Next Architecture: Full-Stack Remix/Next.js vs Vite SPA + Go Backend',
    icon: 'Cpu',
    category: 'Technology & Code',
    dilemma: 'Our engineering team is kicking off a customer-facing SaaS portal with real-time dashboarding.',
    options: [
      'Remix/Next.js Unified Full-Stack: Single TypeScript codebase, SSR/RSC performance, faster MVP turnaround',
      'Decoupled Vite React SPA + Go Microservices: High throughput API, independent deployments, strong type-safety'
    ],
    priorities: 'Time-to-market for MVP, developer velocity, maintenance overhead, long-term scalability'
  },
  {
    id: 'launch-timing',
    title: 'Product Launch: Launch Beta Today vs Polish for 6 More Weeks',
    icon: 'Rocket',
    category: 'Business & Strategy',
    dilemma: 'Our MVP core flows work, but UI polish, onboarding tour, and automated billing edge cases are rough.',
    options: [
      'Launch Beta Today (Public): Invite early adopters, get brutal market feedback, manual onboarding touchpoints',
      'Delay 6 Weeks for Polish: Complete automated billing, slick onboarding UI, robust error logging, smoother first impression'
    ],
    priorities: 'Fast user feedback, avoiding reputation damage, conserving runway, validating core value proposition'
  },
  {
    id: 'relocate-city',
    title: 'Relocate to Austin/NYC vs Stay in Hometown',
    icon: 'MapPin',
    category: 'Lifestyle & Life',
    dilemma: 'I received a promotion allowing relocation to a major tech hub with higher cost of living or staying local.',
    options: [
      'Relocate to Major Tech Hub: Higher networking density, exciting cultural scene, higher rent and living costs',
      'Stay in Current City: Close to extended family & friends, affordable housing, quiet routine, stable community'
    ],
    priorities: 'Personal growth, friendship & support network, financial savings rate, lifestyle energy'
  },
  {
    id: 'car-electric-hybrid',
    title: 'Vehicle Purchase: Full EV (Model Y) vs Plug-in Hybrid (RAV4 Prime)',
    icon: 'Car',
    category: 'Purchases',
    dilemma: 'Looking for a reliable family car for daily 25-mile commuting plus 3-4 annual road trips.',
    options: [
      'All-Electric SUV: Zero gas, home charging convenience, supercharger network, reliance on charging stops',
      'Plug-in Hybrid (PHEV): 42-mile pure electric range for daily commute, gas engine for frictionless road trips'
    ],
    priorities: 'Total cost of ownership, road trip convenience, environmental footprint, resale value'
  }
];
