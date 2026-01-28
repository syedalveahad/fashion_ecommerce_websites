import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { pixel_id, active } = await request.json();

    const { data: existing } = await supabase
      .from('fb_pixel_settings')
      .select('*')
      .maybeSingle();

    if (existing) {
      await supabase
        .from('fb_pixel_settings')
        .update({
          pixel_id,
          active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('fb_pixel_settings')
        .insert({
          pixel_id,
          active,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
