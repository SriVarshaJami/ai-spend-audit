'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PLANS: Record<string, string[]> = {
  cursor: ['hobby', 'pro', 'business', 'enterprise'],
  githubCopilot: ['individual', 'business', 'enterprise'],
  claude: ['free', 'pro', 'max', 'team', 'enterprise', 'api'],
  chatgpt: ['plus', 'team', 'enterprise', 'api'],
  anthropicApi: ['pay-as-you-go'],
  openaiApi: ['pay-as-you-go'],
  gemini: ['pro', 'ultra', 'api'],
  windsurf: ['free', 'pro', 'team'],
};

const TOOL_LABELS: Record<string, string> = {
  cursor: 'Cursor',
  githubCopilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropicApi: 'Anthropic API',
  openaiApi: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
};

interface ToolState {
  enabled: boolean;
  plan: string;
  seats: number;
  monthlySpend: number;
}

interface FormState {
  cursor: ToolState;
  githubCopilot: ToolState;
  claude: ToolState;
  chatgpt: ToolState;
  anthropicApi: ToolState;
  openaiApi: ToolState;
  gemini: ToolState;
  windsurf: ToolState;
  teamSize: number;
  useCase: string;
}

const defaultTool: ToolState = { enabled: false, plan: '', seats: 1, monthlySpend: 0 };

const defaultForm: FormState = {
  cursor: { ...defaultTool },
  githubCopilot: { ...defaultTool },
  claude: { ...defaultTool },
  chatgpt: { ...defaultTool },
  anthropicApi: { ...defaultTool },
  openaiApi: { ...defaultTool },
  gemini: { ...defaultTool },
  windsurf: { ...defaultTool },
  teamSize: 1,
  useCase: 'coding',
};

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('auditFormState');
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auditFormState', JSON.stringify(form));
  }, [form]);

  const updateTool = (toolKey: keyof FormState, field: string, value: string | number | boolean) => {
    setForm(prev => ({
      ...prev,
      [toolKey]: { ...(prev[toolKey] as ToolState), [field]: value },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.auditId) {
        router.push(`/audit/${data.auditId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gradient-to-b from-green-900 to-gray-950 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Spend Audit</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Find out exactly where your team is overspending on AI tools — free, instant, no login required.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Team Size</label>
              <input
                type="number"
                min={1}
                value={form.teamSize}
                onChange={e => setForm(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Primary Use Case</label>
              <select
                value={form.useCase}
                onChange={e => setForm(prev => ({ ...prev, useCase: e.target.value }))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white"
              >
                <option value="coding">Coding</option>
                <option value="writing">Writing</option>
                <option value="data">Data</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">Your AI Tools</h2>
          {Object.keys(PLANS).map((toolKey) => {
            const tool = form[toolKey as keyof FormState] as ToolState;
            const plans = PLANS[toolKey];
            return (
              <div key={toolKey} className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{TOOL_LABELS[toolKey]}</h3>
                  <div
                    onClick={() => updateTool(toolKey as keyof FormState, 'enabled', !tool.enabled)}
                    className={`w-12 h-6 rounded-full transition-colors ${tool.enabled ? 'bg-green-500' : 'bg-gray-600'} relative cursor-pointer`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${tool.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </div>
                </div>
                {tool.enabled && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Plan</label>
                      <select
                        value={tool.plan}
                        onChange={e => updateTool(toolKey as keyof FormState, 'plan', e.target.value)}
                        className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white text-sm"
                      >
                        <option value="">Select plan</option>
                        {plans.map((p: string) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Seats</label>
                      <input
                        type="number"
                        min={1}
                        value={tool.seats}
                        onChange={e => updateTool(toolKey as keyof FormState, 'seats', Number(e.target.value))}
                        className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Monthly Spend ($)</label>
                      <input
                        type="number"
                        min={0}
                        value={tool.monthlySpend}
                        onChange={e => updateTool(toolKey as keyof FormState, 'monthlySpend', Number(e.target.value))}
                        className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-600 text-black font-bold py-4 rounded-2xl text-lg transition-colors"
        >
          {loading ? 'Analyzing your spend...' : 'Get My Free Audit →'}
        </button>
      </div>
    </main>
  );
}