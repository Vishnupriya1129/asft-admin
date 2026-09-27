import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET — list all hero records
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('hero')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
  }
}

// POST — create hero
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('hero')
      .insert([{
        title: body.title,
        subtitle: body.subtitle || null,
        button_text: body.button_text || null,
        button_link: body.button_link || null,
        images: body.images || [],
        is_active: body.is_active ?? true,
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating hero:', error);
    return NextResponse.json({ error: 'Failed to create hero' }, { status: 500 });
  }
}