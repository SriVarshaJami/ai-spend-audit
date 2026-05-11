import { NextRequest, NextResponse } from 'next/server';

interface Finding {
  tool: string;
  recommendedAction: string;
  reason: string;
}

interface AuditResult {
  totalMonthlySavings: number;
  findings: Finding[];
}

export async function POST(req: NextRequest) {
  try {
    const { auditResult }: { auditResult: AuditResult } = await req.json();

    const prompt = `You are a financial advisor for startups. Write a 100-word personalized audit summary.
The startup's total monthly savings opportunity is $${auditResult.totalMonthlySavings}.
Key findings: ${JSON.stringify(auditResult.findings.map((f: Finding) => ({ tool: f.tool, action: f.recommendedAction, reason: f.reason })))}
Be direct, specific, and actionable. No fluff. Start with the biggest win.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const summary = data.content?.[0]?.text;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json({
      summary: `Based on your audit, optimizing your AI tool stack could save your team significant budget every month. Focus on eliminating duplicate tools and right-sizing plans to your actual team usage.`,
    });
  }
}