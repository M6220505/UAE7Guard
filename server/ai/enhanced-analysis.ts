/**
 * Enhanced AI Analysis with Real Scam Knowledge
 */

import OpenAI from 'openai';
import { REAL_SCAM_PATTERNS, detectScamPattern, getTotalScamLosses } from './scam-patterns';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || 'sk-placeholder',
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface EnhancedAIAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  matchedPatterns: string[];
  warnings: string[];
  recommendations: string[];
  reasoning: string;
  confidence: number;
}

/**
 * Analyze wallet/transaction with real scam pattern knowledge
 */
export async function analyzeWithRealPatterns(data: {
  address: string;
  transactionCount?: number;
  balance?: string;
  age?: string;
  contractCode?: string;
  socialMedia?: string[];
  websiteContent?: string;
}): Promise<EnhancedAIAnalysis> {
  try {
    // Detect potential patterns from data
    const indicators = {
      hasAnonymousTeam: !data.socialMedia || data.socialMedia.length === 0,
      unverifiedContract: !!data.contractCode && data.contractCode.includes('unverified'),
      noLiquidity: data.balance === '0' || !data.balance,
    };

    const matchedPatterns = detectScamPattern(indicators);

    // Build context with real scam knowledge
    const scamContext = `
You are a blockchain security expert analyzing cryptocurrency addresses and projects.

REAL SCAM PATTERNS TO WATCH FOR:
${REAL_SCAM_PATTERNS.slice(0, 5).map(p => `
- ${p.name}: ${p.description}
  Indicators: ${p.indicators.slice(0, 3).join(', ')}
  Real Examples: ${p.realExamples[0]}
`).join('\n')}

HISTORICAL CONTEXT:
- Over $14 billion lost to crypto scams since 2014
- Major incidents: OneCoin ($4B), Africrypt ($3.6B), PlusToken ($2.9B)
- Most common: Ponzi schemes, rug pulls, fake ICOs

ANALYSIS DATA:
Address: ${data.address}
Transaction Count: ${data.transactionCount || 'Unknown'}
Balance: ${data.balance || 'Unknown'}
Account Age: ${data.age || 'Unknown'}
${data.contractCode ? `Contract: ${data.contractCode.substring(0, 100)}...` : ''}
${data.socialMedia ? `Social Media: ${data.socialMedia.join(', ')}` : ''}

TASK:
Analyze this address/project for scam indicators. Consider:
1. Does it match any known scam patterns?
2. Are there red flags (anonymous team, unverified code, no liquidity)?
3. Does the behavior resemble historical scams?
4. What's the risk level?

Provide:
- Risk score (0-100)
- Risk level (LOW/MEDIUM/HIGH/CRITICAL)
- Specific warnings
- Actionable recommendations
- Brief reasoning

Be factual and reference real scam patterns when applicable.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a blockchain security expert with deep knowledge of cryptocurrency scams and fraud patterns. Base your analysis on real historical scams and verified threat intelligence.',
        },
        {
          role: 'user',
          content: scamContext,
        },
      ],
      temperature: 0.3, // Lower for more factual analysis
      max_tokens: 800,
    });

    const aiResponse = response.choices[0]?.message?.content || '';

    // Parse AI response (simplified - in production use structured output)
    const riskScore = extractRiskScore(aiResponse);
    const riskLevel = getRiskLevel(riskScore);
    const warnings = extractWarnings(aiResponse);
    const recommendations = extractRecommendations(aiResponse);

    return {
      riskScore,
      riskLevel,
      matchedPatterns: matchedPatterns.map(p => p.name),
      warnings,
      recommendations,
      reasoning: aiResponse,
      confidence: matchedPatterns.length > 0 ? 85 : 70,
    };
  } catch (error) {
    console.error('[AI-ANALYSIS] Error:', error);
    
    // Fallback to pattern-based analysis
    const indicators = {
      hasAnonymousTeam: !data.socialMedia,
      unverifiedContract: !!data.contractCode,
    };
    
    const matchedPatterns = detectScamPattern(indicators);
    
    return {
      riskScore: matchedPatterns.length > 0 ? 65 : 30,
      riskLevel: matchedPatterns.length > 0 ? 'MEDIUM' : 'LOW',
      matchedPatterns: matchedPatterns.map(p => p.name),
      warnings: matchedPatterns.length > 0 
        ? ['Matches known scam patterns'] 
        : ['No obvious red flags'],
      recommendations: ['Verify team identity', 'Check contract code', 'Start with small amounts'],
      reasoning: 'AI analysis unavailable - using pattern matching',
      confidence: 60,
    };
  }
}

function extractRiskScore(text: string): number {
  const match = text.match(/risk score[:\s]+(\d+)/i);
  return match ? parseInt(match[1]) : 50;
}

function getRiskLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

function extractWarnings(text: string): string[] {
  const warnings: string[] = [];
  const warningSection = text.match(/warnings?[:\s]+(.*?)(?=recommendations?|$)/is);
  
  if (warningSection) {
    const lines = warningSection[1].split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^[-*•]\s*/, '').trim();
      if (cleaned && cleaned.length > 10) {
        warnings.push(cleaned);
      }
    }
  }
  
  return warnings.slice(0, 5);
}

function extractRecommendations(text: string): string[] {
  const recommendations: string[] = [];
  const recSection = text.match(/recommendations?[:\s]+(.*?)(?=reasoning|$)/is);
  
  if (recSection) {
    const lines = recSection[1].split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^[-*•]\s*/, '').trim();
      if (cleaned && cleaned.length > 10) {
        recommendations.push(cleaned);
      }
    }
  }
  
  return recommendations.slice(0, 5);
}

/**
 * Get real-time scam intelligence summary
 */
export function getScamIntelligence(): {
  totalLosses: string;
  activePatterns: number;
  recentTrends: string[];
} {
  const losses = getTotalScamLosses();
  
  return {
    totalLosses: `$${(losses.totalUSD / 1_000_000_000).toFixed(1)}B+`,
    activePatterns: REAL_SCAM_PATTERNS.length,
    recentTrends: [
      'Pig butchering scams increasing',
      'AI-generated fake projects',
      'Cross-chain rug pulls',
      'Fake airdrop sites',
    ],
  };
}
