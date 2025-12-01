
import type { Program, Coach, BlogPost, Offer, Lead, SiteSettings, Testimonial, MembershipTier, PlanInquiry, FreeResource, LegalPage, CounselingService } from '../types.ts';
import { SEED_PROGRAMS, SEED_COACHES, SEED_BLOGS, SEED_OFFERS, SEED_SETTINGS, SEED_TESTIMONIALS, SEED_MEMBERSHIPS, SEED_FREE_RESOURCES, SEED_LEGAL_PAGES, SEED_COUNSELING } from '../constants.ts';

const KEYS = {
  PROGRAMS: 'aa_programs',
  COACHES: 'aa_coaches',
  BLOGS: 'aa_blogs',
  OFFERS: 'aa_offers',
  LEADS: 'aa_leads',
  SETTINGS: 'aa_settings',
  TESTIMONIALS: 'aa_testimonials',
  MEMBERSHIPS: 'aa_memberships',
  PLAN_INQUIRIES: 'aa_plan_inquiries',
  FREE_RESOURCES: 'aa_free_resources',
  LEGAL_PAGES: 'aa_legal_pages',
  COUNSELING: 'aa_counseling',
  AUTH: 'aa_auth_data',
  VERSION: 'aa_data_version_v1.9', 
};

// --- Helper Functions ---
const get = <T>(key: string, defaultVal: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultVal;
  try {
    return JSON.parse(stored);
  } catch {
    return defaultVal;
  }
};

const set = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Data Access ---

export const StorageService = {
  init: () => {
    if (!localStorage.getItem(KEYS.VERSION)) {
       console.log('Seeding initial data...');
       set(KEYS.PROGRAMS, SEED_PROGRAMS);
       set(KEYS.COACHES, SEED_COACHES);
       set(KEYS.BLOGS, SEED_BLOGS);
       set(KEYS.OFFERS, SEED_OFFERS);
       set(KEYS.TESTIMONIALS, SEED_TESTIMONIALS);
       set(KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
       set(KEYS.FREE_RESOURCES, SEED_FREE_RESOURCES);
       set(KEYS.LEGAL_PAGES, SEED_LEGAL_PAGES);
       set(KEYS.COUNSELING, SEED_COUNSELING);
       set(KEYS.SETTINGS, SEED_SETTINGS);
       localStorage.setItem(KEYS.VERSION, 'true');
    }

    if (!localStorage.getItem(KEYS.AUTH)) {
        const defaultAuth = {
            passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
            securityPhraseHash: '', 
        };
        set(KEYS.AUTH, defaultAuth);
    }
  },

  // Programs
  getPrograms: (): Program[] => get(KEYS.PROGRAMS, []),
  savePrograms: (programs: Program[]) => set(KEYS.PROGRAMS, programs),

  // Coaches
  getCoaches: (): Coach[] => get(KEYS.COACHES, []),
  saveCoaches: (coaches: Coach[]) => set(KEYS.COACHES, coaches),

  // Blogs
  getBlogs: (): BlogPost[] => get(KEYS.BLOGS, []),
  saveBlogs: (blogs: BlogPost[]) => set(KEYS.BLOGS, blogs),

  // Offers
  getOffers: (): Offer[] => get(KEYS.OFFERS, []),
  saveOffers: (offers: Offer[]) => set(KEYS.OFFERS, offers),

  // Testimonials
  getTestimonials: (): Testimonial[] => get(KEYS.TESTIMONIALS, []),
  saveTestimonials: (testimonials: Testimonial[]) => set(KEYS.TESTIMONIALS, testimonials),

  // Memberships
  getMemberships: (): MembershipTier[] => get(KEYS.MEMBERSHIPS, []),
  saveMemberships: (tiers: MembershipTier[]) => set(KEYS.MEMBERSHIPS, tiers),

  // Leads
  getLeads: (): Lead[] => get(KEYS.LEADS, []),
  addLead: (lead: Lead) => {
    const leads = get<Lead[]>(KEYS.LEADS, []);
    set(KEYS.LEADS, [lead, ...leads]);
  },
  deleteLead: (id: string) => {
    const leads = get<Lead[]>(KEYS.LEADS, []);
    set(KEYS.LEADS, leads.filter(l => l.id !== id));
  },

  // Plan Inquiries
  getPlanInquiries: (): PlanInquiry[] => get(KEYS.PLAN_INQUIRIES, []),
  addPlanInquiry: (inquiry: PlanInquiry) => {
    const list = get<PlanInquiry[]>(KEYS.PLAN_INQUIRIES, []);
    set(KEYS.PLAN_INQUIRIES, [inquiry, ...list]);
  },
  deletePlanInquiry: (id: string) => {
    const list = get<PlanInquiry[]>(KEYS.PLAN_INQUIRIES, []);
    set(KEYS.PLAN_INQUIRIES, list.filter(l => l.id !== id));
  },

  // Free Resources
  getFreeResources: (): FreeResource[] => get(KEYS.FREE_RESOURCES, []),
  saveFreeResources: (resources: FreeResource[]) => set(KEYS.FREE_RESOURCES, resources),

  // Legal Pages
  getLegalPages: (): LegalPage[] => get(KEYS.LEGAL_PAGES, []),
  saveLegalPages: (pages: LegalPage[]) => set(KEYS.LEGAL_PAGES, pages),

  // Counseling
  getCounselingServices: (): CounselingService[] => get(KEYS.COUNSELING, []),
  saveCounselingServices: (services: CounselingService[]) => set(KEYS.COUNSELING, services),

  // Settings
  getSettings: (): SiteSettings => get(KEYS.SETTINGS, SEED_SETTINGS),
  saveSettings: (settings: SiteSettings) => set(KEYS.SETTINGS, settings),

  // Auth
  verifyPassword: async (input: string): Promise<boolean> => {
    const authData = get(KEYS.AUTH, { passwordHash: '' });
    const inputHash = await sha256(input);
    return inputHash === authData.passwordHash;
  },
  
  verifySecurityPhrase: async (input: string): Promise<boolean> => {
    const authData = get(KEYS.AUTH, { securityPhraseHash: '' });
    if (!authData.securityPhraseHash) return false; // If not set, cannot verify
    const inputHash = await sha256(input.trim().toLowerCase());
    return inputHash === authData.securityPhraseHash;
  },

  updatePassword: async (newPass: string) => {
    const authData = get(KEYS.AUTH, { passwordHash: '', securityPhraseHash: '' });
    authData.passwordHash = await sha256(newPass);
    set(KEYS.AUTH, authData);
  },

  setSecurityPhrase: async (phrase: string) => {
    const authData = get(KEYS.AUTH, { passwordHash: '', securityPhraseHash: '' });
    authData.securityPhraseHash = await sha256(phrase.trim().toLowerCase());
    set(KEYS.AUTH, authData);
  }
};
