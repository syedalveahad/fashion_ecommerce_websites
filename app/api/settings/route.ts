import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const settings: Record<string, string> = {};
    data.forEach((setting) => {
      settings[setting.key] = setting.value;
    });

    const { data: pixelData } = await supabase
      .from('fb_pixel_settings')
      .select('*')
      .maybeSingle();

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        fb_pixel_id: pixelData?.pixel_id || '',
        fb_pixel_active: pixelData?.active || false,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
