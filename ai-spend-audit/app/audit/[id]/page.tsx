'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

interface Finding {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  savings: number;
  reason: string;
  isOptimal: boolean;
}

interface AuditResult {
  findings: Finding[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export default function AuditPage() {
  const params = useParams();
  const [result, setResult] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAudit = async () => {
      const { data } = await supabase
        .from('audits')
        .select('result')
        .eq('id', params.id)
        .single();

      if (data) {
        setResult(data.result);
        fetchSummary(data.result);
      }
      setLoading(false);
    };
    fetchAudit();
  }, [params.id]);

  const fetchSummary = async (auditResult: AuditResult) => {
    const res = await fetch('/api/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditResult }),
    });
    const data = await res.json();
    setSummary(data.summary);
  };

  const handleEmailSubmit = async () => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditId: params.id, email }),
    });
    setSubmitted(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-xl">Loading your audit...</p>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-xl">Audit not found.</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero savings */}
      <div className="bg-gradient-to-b from-green-900 to-gray-950 py-16 px-4 text-center">
        <p className="text-gray-300 mb-2">Your monthly savings opportunity</p>
        <h1 className="text-6xl font-bold text-green-400">
          ${result.totalMonthlySavings.toLocaleString()}
        </h1>
        <p className="text-gray-400 mt-2">
          ${result.totalAnnualSavings.toLocaleString()} per year
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">

        {/* AI Summary */}
        {summary && (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-3">📋 Your Personalized Summary</h2>
            <p className="text-gray-300">{summary}</p>
          </div>
        )}

        {/* Per tool findings */}
        <h2 className="text-xl font-semibold">Breakdown by Tool</h2>
        {result.findings.map((finding, i) => (
          <div key={i} className={`rounded-2xl p-6 ${finding.isOptimal ? 'bg-gray-900' : 'bg-gray-900 border border-green-700'}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{finding.tool}</h3>
              {finding.savings > 0 && (
                <span className="bg-green-500 text-black font-bold px-3 py-1 rounded-full text-sm">
                  Save ${finding.savings}/mo
                </span>
              )}
              {finding.isOptimal && (
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  ✓ Optimal
                </span>
              )}
            </div>
            <p className="text-green-400 font-medium mb-1">{finding.recommendedAction}</p>
            <p className="text-gray-400 text-sm">{finding.reason}</p>
            {!finding.isOptimal && (
              <div className="mt-3 flex gap-6 text-sm">
                <span className="text-gray-500">Current: <span className="text-white">${finding.currentSpend}/mo</span></span>
                <span className="text-gray-500">Recommended: <span className="text-green-400">${finding.recommendedSpend}/mo</span></span>
              </div>
            )}
          </div>
        ))}

        {/* Credex CTA for high savings */}
        {result.totalMonthlySavings > 500 && (
          <div className="bg-green-900 border border-green-500 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold mb-2">💰 You qualify for Credex credits</h2>
            <p className="text-gray-300 mb-4">At ${result.totalMonthlySavings}/mo savings, you could save even more with discounted AI credits through Credex.</p>
            <a href="https://credex.rocks" target="_blank" className="bg-green-500 text-black font-bold px-8 py-3 rounded-xl inline-block">
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        {/* Email capture */}
        {!submitted ? (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-2">📧 Get this report in your inbox</h2>
            <p className="text-gray-400 text-sm mb-4">We'll send you the full audit and notify you when new savings apply to your stack.</p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 rounded-lg px-4 py-2 text-white"
              />
              <button
                onClick={handleEmailSubmit}
                className="bg-green-500 text-black font-bold px-6 py-2 rounded-lg"
              >
                Send Report
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-6 text-center">
            <p className="text-green-400 font-semibold">✅ Report sent! Check your inbox.</p>
          </div>
        )}

        {/* Share */}
        <div className="bg-gray-900 rounded-2xl p-6 text-center">
          <h2 className="font-semibold mb-2">🔗 Share your audit</h2>
          <p className="text-gray-400 text-sm mb-3">Share this link with your team</p>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg text-sm"
          >
            Copy Link
          </button>
        </div>

      </div>
    </main>
  );
}