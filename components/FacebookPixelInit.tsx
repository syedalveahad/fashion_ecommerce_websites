'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initFacebookPixel, trackPageView } from '@/lib/fbtrack';

export default function FacebookPixelInit() {
  const pathname = usePathname();

  useEffect(() => {
    const fetchPixelSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const result = await response.json();

        if (result.success && result.data.fb_pixel_active && result.data.fb_pixel_id) {
          initFacebookPixel(result.data.fb_pixel_id);
          trackPageView();
        }
      } catch (error) {
        console.error('Error loading Facebook Pixel settings:', error);
      }
    };

    fetchPixelSettings();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}
