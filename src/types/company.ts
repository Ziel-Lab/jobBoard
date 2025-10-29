export interface Company {
  id: string
  subdomain: string
  companyName: string
  logoUrl?: string
  websiteUrl?: string
  industry: string
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise'
  subscriptionTier: string
  subscriptionStatus: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  trialEndsAt?: string
  subscriptionEndsAt?: string
  settings: Record<string, unknown>
  branding: {
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    textColor?: string
    backgroundColor?: string
  }
  isActive: boolean
  isVerified: boolean
  createdAt: string
  updatedAt: string
  deletedAt?: string
  location: string
  companyDescription: string
  ownerId: string
}

export interface CompanyBranding {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  textColor?: string
  backgroundColor?: string
  logoUrl?: string
}
