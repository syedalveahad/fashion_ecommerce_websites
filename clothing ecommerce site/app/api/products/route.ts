import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (condition) {
      query = query.contains('conditions', [condition]);
    }

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
