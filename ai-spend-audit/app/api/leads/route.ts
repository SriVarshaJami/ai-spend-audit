import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { runAudit } from '../../../lib/auditEngine';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = runAudit(input);

    const { data, error } = await supabase
      .from('audits')
      .insert({ input, result })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ auditId: data.id, result });
  } catch (error) {
    console.error('Audit error:', error);
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 500 }
    );
  }
}