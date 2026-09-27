import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from('testimonials').select('*').order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    if (!body.name || !body.content) return NextResponse.json({ error: 'Name and content required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([{
        name: body.name,
        role: body.role || null,
        content: body.content,
        rating: body.rating ? parseInt(body.rating) : 5,
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
        sort_order: body.sort_order ? parseInt(body.sort_order) : 0,
        linkedin_url: body.linkedin_url || null,
      }])
      .select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}