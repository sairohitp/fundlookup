export enum FundStatus {
  OPEN = 'Open',
  CLOSING_SOON = 'Closing Soon',
  CLOSED = 'Closed',
  WAITLIST = 'Waitlist',
}

export enum FundSource {
  CENTRAL_GOVERNMENT = 'Central Government',
  STATE_GOVERNMENT = 'State Government',
  PRIVATE_FOUNDATION = 'Private Foundation',
  CORPORATE = 'Corporate',
  INTERNATIONAL = 'International',
}

export enum StartupStage {
  IDEA = 'Idea Stage',
  EARLY = 'Early Stage',
  GROWTH = 'Growth Stage',
  SCALEUP = 'Scale-Up',
  ALL = 'All Stages',
}

export enum FundingType {
  GRANT = 'Grant',
  LOAN = 'Loan',
  EQUITY = 'Equity',
  FINANCIAL_ASSISTANCE = 'Financial Assistance',
  SUBSIDY = 'Subsidy',
}

export interface Fund {
  id: string;
  title: string;
  providedBy: string; // Ministry or organization
  status: FundStatus;
  sectors: string[]; // Replaces single category
  websiteUrl: string;
  fundingSupport: string; // e.g., "INR 10 lakhs - 1.5 crores"
  source: FundSource;
  schemeDocumentUrl: string;
  applicationProcess: string; // Can be a long text or a URL
  implementationAgency: string;
  startupStage: StartupStage[];
  fundingType: FundingType[];
  otherSupport: string[]; // e.g., "Technical audit", "advisory services"
  referenceUrl: string;
  description: string; // A short summary
}

export interface FilterState {
  search: string;
  sector: string; // Allow filtering by a single sector string for now
  status: FundStatus | 'All';
  source: FundSource | 'All';
}
