import { AuditInput, AuditFinding, AuditResult } from '../types';

export function runAudit(input: AuditInput): AuditResult {
  const findings: AuditFinding[] = [];

  // --- CURSOR ---
  if (input.cursor.enabled) {
    const spend = input.cursor.monthlySpend;
    if (input.cursor.plan === 'business' && input.teamSize <= 3) {
      findings.push({
        tool: 'Cursor',
        currentSpend: spend,
        recommendedAction: 'Downgrade to Pro plan',
        recommendedSpend: input.cursor.seats * 20,
        savings: spend - input.cursor.seats * 20,
        reason: 'Business plan is designed for 4+ person teams needing admin controls. Pro gives identical AI coding features at half the cost for small teams.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'Cursor',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your Cursor plan matches your team size and use case.',
        isOptimal: true,
      });
    }
  }

  // --- GITHUB COPILOT ---
  if (input.githubCopilot.enabled) {
    const spend = input.githubCopilot.monthlySpend;
    if (input.githubCopilot.plan === 'enterprise' && input.teamSize <= 10) {
      findings.push({
        tool: 'GitHub Copilot',
        currentSpend: spend,
        recommendedAction: 'Downgrade to Business plan',
        recommendedSpend: input.githubCopilot.seats * 19,
        savings: spend - input.githubCopilot.seats * 19,
        reason: 'Enterprise adds SSO and audit logs but Business covers all core AI coding features. For teams under 10, the difference rarely justifies the cost.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'GitHub Copilot',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your GitHub Copilot plan is appropriate for your team.',
        isOptimal: true,
      });
    }
  }

  // --- CLAUDE ---
  if (input.claude.enabled) {
    const spend = input.claude.monthlySpend;
    if (input.claude.plan === 'team' && input.teamSize <= 2) {
      findings.push({
        tool: 'Claude',
        currentSpend: spend,
        recommendedAction: 'Switch to Pro (individual) plans',
        recommendedSpend: input.claude.seats * 20,
        savings: spend - input.claude.seats * 20,
        reason: 'Team plan requires minimum 5 seats. For 1-2 users, individual Pro plans are cheaper and provide the same output quality.',
        isOptimal: false,
      });
    } else if (input.claude.plan === 'max' && input.useCase === 'writing') {
      findings.push({
        tool: 'Claude',
        currentSpend: spend,
        recommendedAction: 'Downgrade to Pro plan',
        recommendedSpend: input.claude.seats * 20,
        savings: spend - input.claude.seats * 20,
        reason: 'Max plan is built for heavy API and coding workloads. For writing use cases, Pro provides sufficient context and generation quality.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'Claude',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your Claude plan fits your usage pattern.',
        isOptimal: true,
      });
    }
  }

  // --- CHATGPT ---
  if (input.chatgpt.enabled) {
    const spend = input.chatgpt.monthlySpend;
    if (input.chatgpt.plan === 'plus' && input.useCase === 'coding') {
      findings.push({
        tool: 'ChatGPT',
        currentSpend: spend,
        recommendedAction: 'Consider switching to Cursor or Claude for coding',
        recommendedSpend: 20,
        savings: spend - 20,
        reason: 'For coding workflows, Cursor (IDE-native) or Claude (stronger code reasoning) outperform ChatGPT Plus at the same or lower price point.',
        isOptimal: false,
      });
    } else if (input.chatgpt.plan === 'team' && input.claude.enabled) {
      findings.push({
        tool: 'ChatGPT',
        currentSpend: spend,
        recommendedAction: 'Consolidate to Claude Team — avoid duplicate spend',
        recommendedSpend: 0,
        savings: spend,
        reason: 'You are paying for both ChatGPT Team and Claude. These tools overlap significantly. Pick one primary LLM to eliminate redundant spend.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'ChatGPT',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your ChatGPT plan is reasonable for your use case.',
        isOptimal: true,
      });
    }
  }

  // --- ANTHROPIC API ---
  if (input.anthropicApi.enabled) {
    const spend = input.anthropicApi.monthlySpend;
    if (spend > 500) {
      findings.push({
        tool: 'Anthropic API',
        currentSpend: spend,
        recommendedAction: 'Contact Credex for discounted API credits',
        recommendedSpend: spend * 0.7,
        savings: spend * 0.3,
        reason: 'At $500+/month API spend, you qualify for bulk credit discounts through Credex — typically 20-35% off retail API pricing.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'Anthropic API',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your API spend is within normal range. Monitor usage as you scale.',
        isOptimal: true,
      });
    }
  }

  // --- OPENAI API ---
  if (input.openaiApi.enabled) {
    const spend = input.openaiApi.monthlySpend;
    if (spend > 500) {
      findings.push({
        tool: 'OpenAI API',
        currentSpend: spend,
        recommendedAction: 'Contact Credex for discounted API credits',
        recommendedSpend: spend * 0.7,
        savings: spend * 0.3,
        reason: 'At $500+/month OpenAI API spend, bulk credit discounts through Credex can save 20-35% monthly.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'OpenAI API',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your OpenAI API spend is within normal range.',
        isOptimal: true,
      });
    }
  }

  // --- GEMINI ---
  if (input.gemini.enabled) {
    const spend = input.gemini.monthlySpend;
    if (input.gemini.plan === 'ultra' && input.useCase !== 'research') {
      findings.push({
        tool: 'Gemini',
        currentSpend: spend,
        recommendedAction: 'Downgrade to Gemini Pro',
        recommendedSpend: input.gemini.seats * 20,
        savings: spend - input.gemini.seats * 20,
        reason: 'Gemini Ultra\'s main advantage is deep research and multimodal tasks. For coding or writing, Pro delivers comparable results at a lower price.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'Gemini',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Your Gemini plan fits your use case.',
        isOptimal: true,
      });
    }
  }

  // --- WINDSURF ---
  if (input.windsurf.enabled) {
    const spend = input.windsurf.monthlySpend;
    if (input.cursor.enabled) {
      findings.push({
        tool: 'Windsurf',
        currentSpend: spend,
        recommendedAction: 'Eliminate — duplicate of Cursor',
        recommendedSpend: 0,
        savings: spend,
        reason: 'You are paying for both Cursor and Windsurf — two AI coding IDEs with near-identical feature sets. Pick one and cancel the other.',
        isOptimal: false,
      });
    } else {
      findings.push({
        tool: 'Windsurf',
        currentSpend: spend,
        recommendedAction: 'No change needed',
        recommendedSpend: spend,
        savings: 0,
        reason: 'Windsurf is a solid choice for AI-assisted coding.',
        isOptimal: true,
      });
    }
  }

  const totalMonthlySavings = findings.reduce((sum, f) => sum + f.savings, 0);

  return {
    findings,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}