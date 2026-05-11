export interface ToolInput {
  enabled: boolean;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditInput {
  cursor: ToolInput;
  githubCopilot: ToolInput;
  claude: ToolInput;
  chatgpt: ToolInput;
  anthropicApi: ToolInput;
  openaiApi: ToolInput;
  gemini: ToolInput;
  windsurf: ToolInput;
  teamSize: number;
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
}

export interface AuditFinding {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  savings: number;
  reason: string;
  isOptimal: boolean;
}

export interface AuditResult {
  findings: AuditFinding[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  summary?: string;
}