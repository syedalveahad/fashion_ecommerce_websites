'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/CheckoutForm';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handleSuccess = (orderId: string) => {
    clearCart();
    router.push(`/thank-you?order=${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="max-w-2xl mx-auto">
            <CheckoutForm items={cart} onSuccess={handleSuccess} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
