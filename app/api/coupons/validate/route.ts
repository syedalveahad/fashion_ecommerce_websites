import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error || !coupon) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Coupon has expired' },
        { status: 400 }
      );
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json(
        { success: false, message: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    if (subtotal < coupon.min_order_value) {
      return NextResponse.json(
        { success: false, message: `Minimum order value is ${coupon.min_order_value} BDT` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }

    return NextResponse.json({
      success: true,
      discount,
      coupon,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
