'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { trackInitiateCheckout, trackPurchase } from '@/lib/fbtrack';

interface CheckoutFormProps {
  items: CartItem[];
  onSuccess: (orderId: string) => void;
}

export default function CheckoutForm({ items, onSuccess }: CheckoutFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    delivery_area: 'inside' as 'inside' | 'outside',
    customer_note: '',
    coupon_code: '',
  });
  const [discount, setDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await fetch('/api/settings');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCharge = formData.delivery_area === 'inside'
      ? parseFloat(settings?.inside_dhaka_charge || 60)
      : parseFloat(settings?.outside_dhaka_charge || 100);

    trackInitiateCheckout({
      content_ids: items.map(item => item.product_id),
      contents: items.map(item => ({
        id: item.product_id,
        quantity: item.quantity,
      })),
      value: subtotal + deliveryCharge - discount,
      currency: 'BDT',
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  }, [items, formData.delivery_area, settings, discount]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = formData.delivery_area === 'inside'
    ? parseFloat(settings?.inside_dhaka_charge || 60)
    : parseFloat(settings?.outside_dhaka_charge || 100);
  const total = subtotal + deliveryCharge - discount;

  const handleValidateCoupon = async () => {
    if (!formData.coupon_code) return;

    setValidatingCoupon(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.coupon_code,
          subtotal,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDiscount(result.discount);
        toast({
          title: 'Coupon applied!',
          description: `You saved ৳${result.discount}`,
        });
      } else {
        toast({
          title: 'Invalid coupon',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate coupon',
        variant: 'destructive',
      });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_phone || !formData.customer_address) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        items,
        subtotal,
        delivery_charge: deliveryCharge,
        discount,
        total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        trackPurchase({
          content_ids: items.map(item => item.product_id),
          contents: items.map(item => ({
            id: item.product_id,
            quantity: item.quantity,
          })),
          value: total,
          currency: 'BDT',
          num_items: items.reduce((sum, item) => sum + item.quantity, 0),
          order_id: result.data.order_number,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_address: formData.customer_address,
        });

        onSuccess(result.data.order_number);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to place order',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="customer_name">Full Name *</Label>
        <Input
          id="customer_name"
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="customer_phone">Phone Number *</Label>
        <Input
          id="customer_phone"
          type="tel"
          value={formData.customer_phone}
          onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="customer_address">Full Address *</Label>
        <Textarea
          id="customer_address"
          value={formData.customer_address}
          onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="delivery_area">Delivery Area *</Label>
        <Select
          value={formData.delivery_area}
          onValueChange={(value: 'inside' | 'outside') => setFormData({ ...formData, delivery_area: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inside">Inside Dhaka (৳{settings?.inside_dhaka_charge || 60})</SelectItem>
            <SelectItem value="outside">Outside Dhaka (৳{settings?.outside_dhaka_charge || 100})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="customer_note">Order Note (Optional)</Label>
        <Textarea
          id="customer_note"
          value={formData.customer_note}
          onChange={(e) => setFormData({ ...formData, customer_note: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="coupon_code">Coupon Code</Label>
        <div className="flex space-x-2">
          <Input
            id="coupon_code"
            value={formData.coupon_code}
            onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
          />
          <Button
            type="button"
            onClick={handleValidateCoupon}
            disabled={validatingCoupon || !formData.coupon_code}
            variant="outline"
          >
            Apply
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>৳{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge</span>
            <span>৳{deliveryCharge}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-৳{discount}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full" size="lg">
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}
