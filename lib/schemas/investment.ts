import { z } from "zod"

// Investment calculator schema
export const InvestmentCalculatorSchema = z.object({
  propertyPrice: z.number().positive(),
  downPayment: z.number().positive(),
  interestRate: z.number().positive(),
  loanTerm: z.number().int().positive(),
  monthlyRent: z.number().nonnegative(),
  monthlyExpenses: z.number().nonnegative(),
  appreciationRate: z.number(),
  closingCosts: z.number().nonnegative().optional(),
  repairCosts: z.number().nonnegative().optional(),
  vacancyRate: z.number().min(0).max(100).optional(),
  propertyManagementFee: z.number().min(0).max(100).optional(),
  insuranceCost: z.number().nonnegative().optional(),
  propertyTaxRate: z.number().min(0).max(100).optional(),
})

export type InvestmentCalculatorValues = z.infer<typeof InvestmentCalculatorSchema>

// Investment strategy schema
export const InvestmentStrategySchema = z.object({
  region: z.string(),
  budget: z.number().positive(),
  investmentGoals: z.enum([
    "Cash flow",
    "Appreciation",
    "Balanced approach (cash flow and appreciation)",
    "Tax benefits",
    "Portfolio diversification",
  ]),
  timeHorizon: z.enum(["Short-term (1-2 years)", "Medium-term (3-5 years)", "Long-term (5+ years)"]),
  riskTolerance: z.enum(["Conservative", "Moderate", "Aggressive"]),
  existingProperties: z.number().int().nonnegative().optional(),
  preferredPropertyTypes: z.array(z.string()).optional(),
  financingPreference: z.enum(["Conventional", "FHA", "VA", "Cash", "Hard money", "Private"]).optional(),
})

export type InvestmentStrategyValues = z.infer<typeof InvestmentStrategySchema>

// CMA analysis schema
export const CMAAnalysisSchema = z.object({
  propertyId: z.string().uuid(),
  radius: z.number().positive(),
  maxComps: z.number().int().positive(),
  timeFrame: z.number().int().positive().optional(),
  adjustForDifferences: z.boolean().optional(),
})

export type CMAAnalysisValues = z.infer<typeof CMAAnalysisSchema>
