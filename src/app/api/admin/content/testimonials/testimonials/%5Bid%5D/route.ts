import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update({
        name: body.name,
        role: body.role,
        content: body.content,
        rating: body.rating ? parseInt(body.rating) : 5,
        image_url: body.image_url,
        is_active: body.is_active,
        sort_order: body.sort_order ? parseInt(body.sort_order) : 0,
        linkedin_url: body.linkedin_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { error } = await supabaseAdmin.from('testimonials').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: 'Failed' }, { status: 500 }); }
}