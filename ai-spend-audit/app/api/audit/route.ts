import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { runAudit } from '../../../lib/auditEngine';

export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    const result = runAudit(input);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('URL exists:', !!url);
    console.log('KEY exists:', !!key);

    const supabase = createClient(url!, key!);

    const { data, error } = await supabase
      .from('audits')
      .insert({ input, result })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error));
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ auditId: data.id, result });
  } catch (err) {
    console.error('CATCH ERROR:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}