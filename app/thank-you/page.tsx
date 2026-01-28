'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || '';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Thank You for Your Order!</h1>

          {orderNumber && (
            <div className="bg-gray-50 border rounded-lg p-6 mb-6">
              <p className="text-lg mb-2">Your Order Number:</p>
              <p className="text-3xl font-bold text-gray-900">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-4 text-gray-700 mb-8">
            <p className="text-lg">
              We have received your order and will reach out to you soon to confirm your order details.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold mb-2">Delivery Timeline:</p>
              <p>Inside Dhaka: 1-2 business days</p>
              <p>Outside Dhaka: 2-3 business days</p>
            </div>
            <p>
              If you have any questions, feel free to contact us. Thank you for choosing RastaLife!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
