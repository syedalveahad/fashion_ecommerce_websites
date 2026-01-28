'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import { trackViewContent, trackAddToCart } from '@/lib/fbtrack';
import { ShoppingCart, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CheckoutForm from '@/components/CheckoutForm';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}`);
        const result = await response.json();

        if (result.success) {
          setProduct(result.data);

          trackViewContent({
            content_name: result.data.title,
            content_ids: [result.data.id],
            content_type: 'product',
            value: result.data.sale_price || result.data.regular_price,
            currency: 'BDT',
          });

          const productsResponse = await fetch('/api/products');
          const productsResult = await productsResponse.json();
          if (productsResult.success) {
            const filtered = productsResult.data
              .filter((p: Product) => p.id !== result.data.id && p.category === result.data.category)
              .slice(0, 4);
            setRelatedProducts(filtered);
          }
        } else {
          toast({
            title: 'Error',
            description: 'Product not found',
            variant: 'destructive',
          });
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  useEffect(() => {
    if (product?.offer_end_date) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(product.offer_end_date!).getTime();
        const distance = end - now;

        if (distance < 0) {
          setTimeLeft(null);
          clearInterval(timer);
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }

    if (product.colors.options.length > 0) {
      if (product.colors.multiple) {
        if (selectedColors.length !== product.colors.max_selection) {
          toast({
            title: `Please select exactly ${product.colors.max_selection} color${product.colors.max_selection > 1 ? 's' : ''}`,
            variant: 'destructive',
          });
          return;
        }
      } else {
        if (selectedColors.length === 0) {
          toast({
            title: 'Please select a color',
            variant: 'destructive',
          });
          return;
        }
      }
    }

    const price = product.sale_price || product.regular_price;

    addToCart({
      product_id: product.id,
      title: product.title,
      price,
      regular_price: product.regular_price,
      quantity: 1,
      size: selectedSize,
      colors: selectedColors,
      image: product.feature_image,
    });

    trackAddToCart({
      content_name: product.title,
      content_ids: [product.id],
      content_type: 'product',
      value: price,
      currency: 'BDT',
    });

    toast({
      title: '✓ Added to cart!',
      description: `${product.title} has been added to your cart.`,
      className: 'border-green-200 bg-green-50',
      duration: 2000,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }

    if (product.colors.options.length > 0) {
      if (product.colors.multiple) {
        if (selectedColors.length !== product.colors.max_selection) {
          toast({
            title: `Please select exactly ${product.colors.max_selection} color${product.colors.max_selection > 1 ? 's' : ''}`,
            variant: 'destructive',
          });
          return;
        }
      } else {
        if (selectedColors.length === 0) {
          toast({
            title: 'Please select a color',
            variant: 'destructive',
          });
          return;
        }
      }
    }

    setShowBuyNow(true);
  };

  const toggleColor = (color: string) => {
    if (!product) return;

    if (product.colors.multiple) {
      if (selectedColors.includes(color)) {
        setSelectedColors(selectedColors.filter((c) => c !== color));
      } else {
        if (selectedColors.length < product.colors.max_selection) {
          setSelectedColors([...selectedColors, color]);
        } else {
          toast({
            title: `Maximum ${product.colors.max_selection} colors allowed`,
            variant: 'destructive',
          });
        }
      }
    } else {
      setSelectedColors([color]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const allImages = [product.feature_image, ...product.additional_images];
  const price = product.sale_price || product.regular_price;
  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      currentImageIndex === index ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold">৳{price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">৳{product.regular_price}</span>
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      {Math.round(((product.regular_price - product.sale_price!) / product.regular_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {timeLeft && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-600">Offer ends in:</span>
                  </div>
                  <div className="flex space-x-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.days}</div>
                      <div className="text-xs">Days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.hours}</div>
                      <div className="text-xs">Hours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                      <div className="text-xs">Mins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                      <div className="text-xs">Secs</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Select Size *</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {product.colors.options.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">
                    Select Color{product.colors.multiple ? `s (Max: ${product.colors.max_selection})` : ''} *
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.options.map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <Checkbox
                          id={color}
                          checked={selectedColors.includes(color)}
                          onCheckedChange={() => toggleColor(color)}
                        />
                        <label htmlFor={color} className="text-sm cursor-pointer">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.stock !== undefined && (
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-medium text-gray-700">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Buy Now
                </Button>
              </div>

              <div className="prose max-w-none">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="container mx-auto px-4 py-12 mt-8">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Related Products</h2>
                <p className="text-gray-600">You might also like these items</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={showBuyNow} onOpenChange={setShowBuyNow}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>
          <CheckoutForm
            items={[
              {
                product_id: product.id,
                title: product.title,
                price,
                regular_price: product.regular_price,
                quantity: 1,
                size: selectedSize,
                colors: selectedColors,
                image: product.feature_image,
              },
            ]}
            onSuccess={() => {
              setShowBuyNow(false);
              router.push('/thank-you');
            }}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
