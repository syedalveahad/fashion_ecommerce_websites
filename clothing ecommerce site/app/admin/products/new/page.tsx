'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CONDITIONS } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus, Upload } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    regular_price: '',
    sale_price: '',
    feature_image: '',
    additional_images: [] as string[],
    sizes: [] as string[],
    color_options: [] as string[],
    color_multiple: false,
    color_max_selection: '1',
    category: '',
    conditions: [] as string[],
    stock: '',
    offer_end_date: '',
    status: 'published',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.trim()],
      });
      setNewSize('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    });
  };

  const handleAddColor = () => {
    if (newColor.trim() && !formData.color_options.includes(newColor.trim())) {
      setFormData({
        ...formData,
        color_options: [...formData.color_options, newColor.trim()],
      });
      setNewColor('');
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData({
      ...formData,
      color_options: formData.color_options.filter((c) => c !== color),
    });
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    if (url && !formData.additional_images.includes(url)) {
      setFormData({
        ...formData,
        additional_images: [...formData.additional_images, url],
      });
      e.target.value = '';
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData({
      ...formData,
      additional_images: formData.additional_images.filter((img) => img !== url),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        regular_price: parseFloat(formData.regular_price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        feature_image: formData.feature_image,
        additional_images: formData.additional_images,
        sizes: formData.sizes,
        colors: {
          options: formData.color_options,
          multiple: formData.color_multiple,
          max_selection: parseInt(formData.color_max_selection),
        },
        category: formData.category,
        conditions: formData.conditions,
        stock: formData.stock ? parseInt(formData.stock) : null,
        offer_end_date: formData.offer_end_date || null,
        status: formData.status,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Product created',
          description: 'Product has been created successfully',
        });
        router.push('/admin/products');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create product',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const commonSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Will be auto-generated if left empty"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="regular_price">Regular Price (BDT) *</Label>
              <Input
                id="regular_price"
                type="number"
                value={formData.regular_price}
                onChange={(e) => setFormData({ ...formData, regular_price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="sale_price">Sale Price (BDT)</Label>
              <Input
                id="sale_price"
                type="number"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="feature_image">Feature Image URL *</Label>
            <Input
              id="feature_image"
              value={formData.feature_image}
              onChange={(e) => setFormData({ ...formData, feature_image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
            {formData.feature_image && (
              <div className="mt-2">
                <img src={formData.feature_image} alt="Preview" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="additional_images">Additional Images</Label>
            <div className="flex gap-2">
              <Input
                id="additional_images"
                placeholder="https://example.com/image.jpg"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage(e as any);
                  }
                }}
                onBlur={handleAddImage}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  const input = document.getElementById('additional_images') as HTMLInputElement;
                  if (input) {
                    handleAddImage({ target: input } as any);
                  }
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.additional_images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.additional_images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Additional ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Sizes *</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={newSize} onValueChange={setNewSize}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddSize} disabled={!newSize}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-500">Or enter custom size:</div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter size (e.g., M, L, XL)"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSize();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddSize} disabled={!newSize}>
                  Add
                </Button>
              </div>
              {formData.sizes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sizes.map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span>{size}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.sizes.length === 0 && (
                <p className="text-sm text-red-500">At least one size is required</p>
              )}
            </div>
          </div>

          <div>
            <Label>Colors (Optional)</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter color (e.g., Black, White, Red)"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddColor();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddColor} disabled={!newColor}>
                  Add
                </Button>
              </div>
              {formData.color_options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.color_options.map((color) => (
                    <div
                      key={color}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span>{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(color)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {formData.color_options.length > 1 && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="color_multiple"
                  checked={formData.color_multiple}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, color_multiple: checked as boolean })
                  }
                />
                <Label htmlFor="color_multiple">Require multiple color selection</Label>
              </div>

              {formData.color_multiple && (
                <div>
                  <Label htmlFor="color_max">Number of colors customer must select *</Label>
                  <Input
                    id="color_max"
                    type="number"
                    value={formData.color_max_selection}
                    onChange={(e) =>
                      setFormData({ ...formData, color_max_selection: e.target.value })
                    }
                    min="1"
                    max={formData.color_options.length}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Customer must select exactly {formData.color_max_selection} color(s) before adding to cart
                  </p>
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-sm text-orange-500 mt-1">
                No categories found. Please add categories first.
              </p>
            )}
          </div>

          <div>
            <Label>Conditions</Label>
            <div className="space-y-2">
              {CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={formData.conditions.includes(condition)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          conditions: [...formData.conditions, condition],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          conditions: formData.conditions.filter((c) => c !== condition),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={condition}>{condition}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="offer_end_date">Offer End Date</Label>
            <Input
              id="offer_end_date"
              type="datetime-local"
              value={formData.offer_end_date}
              onChange={(e) => setFormData({ ...formData, offer_end_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" disabled={loading || formData.sizes.length === 0 || !formData.category}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
