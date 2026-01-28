import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.sale_price || product.regular_price;
  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-200 card-hover shadow-sm">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={product.feature_image || '/placeholder.jpg'}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-pink-600 text-white border-0 shadow-md px-3 py-1">
              {Math.round(((product.regular_price - product.sale_price!) / product.regular_price) * 100)}% OFF
            </Badge>
          )}
          {product.conditions.includes('New Arrivals') && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-md px-3 py-1">New</Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-lg text-gray-900">৳{price}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">৳{product.regular_price}</span>
            )}
          </div>
          {product.conditions.includes('Free Delivery') && (
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              Free Delivery
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
