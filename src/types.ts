
export interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: string;
  discountPercentage?: number;
  image: string;
  isEnabled: boolean;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  experience: string;
  certifications: string;
  achievements: string;
  image: string;
  socials: {
    instagram?: string;
    youtube?: string;
    linkedin?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string; 
  author: string;
  date: string;
  image: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discountText: string;
  isEnabled: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  features: string[];
  highlight: boolean;
  pricing: {
    monthly: number;
    quarterly?: number;
    biannual?: number;
    yearly?: number;
  };
}

export interface PlanInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Diet' | 'Workout';
  goals: string;
  date: string;
}

export interface FreeResource {
  id: string;
  title: string;
  type: 'Diet' | 'Workout';
  link: string;
  description?: string;
}

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isVisible: boolean;
}

export interface CounselingService {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  isEnabled: boolean;
}

export interface SiteSettings {
  // Branding
  logoUrl?: string; // Base64 string
  faviconUrl?: string; // Base64 string
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  counselingWhatsapp?: string; // Separate number for counseling
  address: string;
  mapEmbedUrl: string;
  
  // Config
  offersEnabled: boolean;
  programCategories: string[];
  contactInterests: string[];
  
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  failedAttempts: number;
  lastFailedAttempt: number | null;
}

export interface CountryCode {
  name: string;
  dial_code: string;
  code: string;
}
