
import type { Program, Coach, BlogPost, Offer, SiteSettings, Testimonial, MembershipTier, FreeResource, LegalPage, CounselingService, CountryCode } from './types.ts';

export const SEED_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Elite Performance',
    description: 'Designed for professional athletes focusing on speed, agility, and explosive power.',
    category: 'Athletic Training',
    price: '₹15,000/mo',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
  },
  {
    id: '2',
    name: 'Functional Strength',
    description: 'Build real-world strength that translates to daily life. Focuses on compound movements.',
    category: 'General Fitness',
    price: '₹6,000/mo',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
  },
  {
    id: '3',
    name: 'Senior Mobility',
    description: 'Low impact exercises designed to improve joint health, balance, and longevity.',
    category: 'Special Programs',
    price: '₹4,500/mo',
    discountPercentage: 10,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
  }
];

export const SEED_COACHES: Coach[] = [
  {
    id: '1',
    name: 'Alex Sterling',
    role: 'Head Performance Coach',
    experience: '12 Years',
    certifications: 'CSCS, NASM-CPT',
    achievements: 'Coached 3 Olympic Athletes.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    socials: { instagram: 'alex_lifts' },
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    role: 'Mobility Specialist',
    experience: '8 Years',
    certifications: 'Yoga Alliance 500hr, DPT',
    achievements: 'Best Mobility Coach 2023.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    socials: { instagram: 'sarah_moves' },
  }
];

export const SEED_BLOGS: BlogPost[] = [
  {
    id: '1',
    title: 'Why Recovery is as Important as Training',
    description: 'Recovery is often overlooked but is crucial for muscle growth and injury prevention.',
    content: 'Recovery is the unsung hero of performance...',
    author: 'Alex Sterling',
    date: '2023-10-15',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  }
];

export const SEED_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'New Year Transformation',
    description: 'Join now and get 2 free personal training sessions.',
    discountText: '2 FREE SESSIONS',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    isEnabled: true,
  }
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'James Carter',
    role: 'Professional Sprinter',
    content: 'The facilities at Athletes Aura are unmatched. I shaved 0.2s off my 100m time.',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  }
];

export const SEED_MEMBERSHIPS: MembershipTier[] = [
  {
    id: '1',
    name: 'Base Fitness',
    description: 'Access to gym floor and cardio equipment.',
    features: ['Open Gym Access (5am - 10pm)', '1 Free Intro Session', 'Locker Room Access'],
    highlight: false,
    pricing: {
      monthly: 2500,
      quarterly: 7000,
      biannual: 13000,
      yearly: 25000
    }
  },
  {
    id: '2',
    name: 'Athlete Pro',
    description: 'Full access + unlimited classes + recovery zone.',
    features: ['Everything in Base', 'Unlimited Group Classes', 'Recovery Zone Access'],
    highlight: true,
    pricing: {
      monthly: 5000,
      quarterly: 14000,
      biannual: 27000,
      yearly: 50000
    }
  }
];

export const SEED_FREE_RESOURCES: FreeResource[] = [
  {
    id: '1',
    title: '7-Day Shred Diet Plan',
    type: 'Diet',
    description: 'A starter guide to leaning out.',
    link: 'https://example.com/diet-plan.pdf'
  },
  {
    id: '2',
    title: 'Home Bodyweight Circuit',
    type: 'Workout',
    description: 'No equipment needed. 20 minute routine.',
    link: 'https://example.com/home-workout.pdf'
  }
];

export const SEED_COUNSELING: CounselingService[] = [
    {
        id: '1',
        title: 'Sports Psychology Session',
        description: 'Overcome mental blocks and build a champion\'s mindset with our certified sports psychologists.',
        price: 2000,
        duration: '60 Mins',
        image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isEnabled: true
    },
    {
        id: '2',
        title: 'Nutritional Consulting',
        description: 'Detailed analysis of your eating habits and a roadmap to better fueling for your sport.',
        price: 1500,
        duration: '45 Mins',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isEnabled: true
    }
];

export const SEED_LEGAL_PAGES: LegalPage[] = [
    {
        id: '1',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        content: '<h1>Privacy Policy</h1><p>Standard privacy policy content...</p>',
        isVisible: true
    },
    {
        id: '2',
        title: 'Terms & Conditions',
        slug: 'terms-and-conditions',
        content: '<h1>Terms & Conditions</h1><p>Standard terms content...</p>',
        isVisible: true
    }
];

export const SEED_SETTINGS: SiteSettings = {
  contactEmail: 'info@athletesaura.com',
  contactPhone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  counselingWhatsapp: '919876543210',
  address: '100 Olympic Way, Sportscity, India',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=...',
  offersEnabled: true,
  programCategories: ['Athletic Training', 'General Fitness', 'Special Programs'],
  contactInterests: ['General Inquiry', 'Athletic Performance', 'Personal Training', 'Membership', 'Counseling'],
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
  },
};

export const ALL_COUNTRY_CODES: CountryCode[] = [
    {name: "India", dial_code: "+91", code: "IN"},
    {name: "United States", dial_code: "+1", code: "US"},
    {name: "United Kingdom", dial_code: "+44", code: "GB"},
    {name: "United Arab Emirates", dial_code: "+971", code: "AE"},
    {name: "Australia", dial_code: "+61", code: "AU"},
    {name: "Canada", dial_code: "+1", code: "CA"},
    {name: "Germany", dial_code: "+49", code: "DE"},
    {name: "France", dial_code: "+33", code: "FR"},
    {name: "Italy", dial_code: "+39", code: "IT"},
    {name: "Spain", dial_code: "+34", code: "ES"},
    {name: "China", dial_code: "+86", code: "CN"},
    {name: "Japan", dial_code: "+81", code: "JP"},
    {name: "Singapore", dial_code: "+65", code: "SG"},
    {name: "Malaysia", dial_code: "+60", code: "MY"},
    {name: "Saudi Arabia", dial_code: "+966", code: "SA"},
    {name: "Qatar", dial_code: "+974", code: "QA"},
    {name: "Kuwait", dial_code: "+965", code: "KW"},
    {name: "Russia", dial_code: "+7", code: "RU"},
    {name: "Brazil", dial_code: "+55", code: "BR"},
    {name: "Mexico", dial_code: "+52", code: "MX"},
    {name: "South Africa", dial_code: "+27", code: "ZA"},
    {name: "New Zealand", dial_code: "+64", code: "NZ"},
    {name: "Afghanistan", dial_code: "+93", code: "AF"},
    {name: "Albania", dial_code: "+355", code: "AL"},
    {name: "Algeria", dial_code: "+213", code: "DZ"},
    {name: "Argentina", dial_code: "+54", code: "AR"},
    {name: "Austria", dial_code: "+43", code: "AT"},
    {name: "Bahrain", dial_code: "+973", code: "BH"},
    {name: "Bangladesh", dial_code: "+880", code: "BD"},
    {name: "Belgium", dial_code: "+32", code: "BE"},
    {name: "Chile", dial_code: "+56", code: "CL"},
    {name: "Colombia", dial_code: "+57", code: "CO"},
    {name: "Denmark", dial_code: "+45", code: "DK"},
    {name: "Egypt", dial_code: "+20", code: "EG"},
    {name: "Finland", dial_code: "+358", code: "FI"},
    {name: "Greece", dial_code: "+30", code: "GR"},
    {name: "Hong Kong", dial_code: "+852", code: "HK"},
    {name: "Indonesia", dial_code: "+62", code: "ID"},
    {name: "Iran", dial_code: "+98", code: "IR"},
    {name: "Ireland", dial_code: "+353", code: "IE"},
    {name: "Israel", dial_code: "+972", code: "IL"},
    {name: "Kenya", dial_code: "+254", code: "KE"},
    {name: "Netherlands", dial_code: "+31", code: "NL"},
    {name: "Nigeria", dial_code: "+234", code: "NG"},
    {name: "Norway", dial_code: "+47", code: "NO"},
    {name: "Pakistan", dial_code: "+92", code: "PK"},
    {name: "Philippines", dial_code: "+63", code: "PH"},
    {name: "Poland", dial_code: "+48", code: "PL"},
    {name: "Portugal", dial_code: "+351", code: "PT"},
    {name: "South Korea", dial_code: "+82", code: "KR"},
    {name: "Sri Lanka", dial_code: "+94", code: "LK"},
    {name: "Sweden", dial_code: "+46", code: "SE"},
    {name: "Switzerland", dial_code: "+41", code: "CH"},
    {name: "Taiwan", dial_code: "+886", code: "TW"},
    {name: "Thailand", dial_code: "+66", code: "TH"},
    {name: "Turkey", dial_code: "+90", code: "TR"},
    {name: "Ukraine", dial_code: "+380", code: "UA"},
    {name: "Vietnam", dial_code: "+84", code: "VN"}
];
