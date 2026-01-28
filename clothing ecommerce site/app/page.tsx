'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ShopByCategory from '@/components/ShopByCategory';
import { Product, CONDITIONS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts: { [key: string]: Product[] } = {};

        for (const condition of CONDITIONS) {
          const response = await fetch(`/api/products?condition=${encodeURIComponent(condition)}&limit=4`);
          const result = await response.json();
          if (result.success) {
            fetchedProducts[condition] = result.data;
          }
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to RastaLife
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                The Roads to Finding the Best Product for You!
              </p>
              <p className="text-lg mb-8 text-gray-300">
                Discover premium quality Bangladeshi fashion clothing. From stylish t-shirts to trendy apparel, find your perfect style with us.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <ShopByCategory />

        {!loading && CONDITIONS.map((condition) => (
          products[condition] && products[condition].length > 0 && (
            <section key={condition} className="py-16">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold">{condition}</h2>
                  <Link href={`/products?condition=${encodeURIComponent(condition)}`}>
                    <Button variant="outline">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products[condition].slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )
        ))}

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  Excellent quality t-shirts! The fabric is soft and comfortable. Highly recommend RastaLife!
                </p>
                <p className="font-semibold">- Ahmed K.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  Fast delivery and great customer service. The designs are unique and stylish!
                </p>
                <p className="font-semibold">- Fatima R.</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  Best prices and amazing quality. RastaLife is now my go-to brand for clothing!
                </p>
                <p className="font-semibold">- Rifat M.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-300">
              At RastaLife, we believe in providing premium quality clothing that reflects the vibrant spirit of Bangladesh.
              Our mission is to make fashion accessible, affordable, and authentic. Every product is crafted with care to ensure
              you look and feel your best.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
