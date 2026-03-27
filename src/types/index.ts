export interface Project {
    id: string;
    name: string;
    idea: string;
    industry?: string;
    targetAudience?: string;
    location?: string;
    createdAt: string;
    marketResearch?: string;
    competitors?: Competitor[];
    websiteCode?: string;
    marketingKit?: MarketingPost[];
    fundingOpportunities?: FundingOpportunity[];
    chatHistory: ChatMessage[];
    webhookUrl?: string;
    zapierWebhookUrl?: string;
}

export interface Competitor {
    name: string;
    strengths: string[];
    weaknesses: string[];
    gap: string;
}

export interface MarketingPost {
    platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'Facebook';
    content: string;
    hashtags: string[];
    imagePrompt: string;
}

export interface FundingOpportunity {
    type: string;
    name: string;
    amount: string;
    description: string;
    matchReason: string;
    link?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model'; // Google GenAI format uses 'user' | 'model'
    content: string;
    timestamp: string;
}
