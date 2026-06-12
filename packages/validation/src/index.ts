import { z } from 'zod';

export const CampaignCreateSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  targetAmount: z.number().positive(),
  sector: z.string(),
  stage: z.enum(['seed', 'series_a', 'series_b', 'growth']),
  location: z.string(),
});

export const InvestmentCreateSchema = z.object({
  campaignId: z.string().uuid(),
  amount: z.number().positive(),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
});
