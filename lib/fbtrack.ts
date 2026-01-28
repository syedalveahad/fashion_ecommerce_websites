import CryptoJS from 'crypto-js';

declare global {
  interface Window {
    fbq: any;
  }
}

export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data.toLowerCase().trim()).toString();
};

export const initFacebookPixel = (pixelId: string) => {
  if (typeof window === 'undefined' || !pixelId) return;

  (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', pixelId);
};

export const trackPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const trackViewContent = (productData: {
  content_name: string;
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: productData.content_name,
      content_ids: productData.content_ids,
      content_type: productData.content_type,
      value: productData.value,
      currency: productData.currency,
    });
  }
};

export const trackAddToCart = (cartData: {
  content_name: string;
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: cartData.content_name,
      content_ids: cartData.content_ids,
      content_type: cartData.content_type,
      value: cartData.value,
      currency: cartData.currency,
    });
  }
};

export const trackInitiateCheckout = (checkoutData: {
  content_ids: string[];
  contents: any[];
  value: number;
  currency: string;
  num_items: number;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: checkoutData.content_ids,
      contents: checkoutData.contents,
      value: checkoutData.value,
      currency: checkoutData.currency,
      num_items: checkoutData.num_items,
    });
  }
};

export const trackPurchase = (purchaseData: {
  content_ids: string[];
  contents: any[];
  value: number;
  currency: string;
  num_items: number;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const userData = {
      em: hashData(purchaseData.customer_phone),
      ph: hashData(purchaseData.customer_phone),
      fn: hashData(purchaseData.customer_name.split(' ')[0] || ''),
      ln: hashData(purchaseData.customer_name.split(' ')[1] || ''),
      ct: hashData('dhaka'),
      country: hashData('bd'),
    };

    window.fbq('track', 'Purchase', {
      content_ids: purchaseData.content_ids,
      contents: purchaseData.contents,
      value: purchaseData.value,
      currency: purchaseData.currency,
      num_items: purchaseData.num_items,
    }, {
      eventID: purchaseData.order_id,
      ...userData
    });
  }
};
