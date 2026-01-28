'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inside_dhaka_charge: settings.inside_dhaka_charge,
          outside_dhaka_charge: settings.outside_dhaka_charge,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Settings saved',
          description: 'Delivery charges updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePixel = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/settings/pixel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pixel_id: settings.fb_pixel_id,
          active: settings.fb_pixel_active,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Settings saved',
          description: 'Facebook Pixel settings updated successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="delivery" className="w-full">
        <TabsList>
          <TabsTrigger value="delivery">Delivery Charges</TabsTrigger>
          <TabsTrigger value="pixel">Facebook Pixel</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Charges</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveDelivery} className="space-y-4">
                <div>
                  <Label htmlFor="inside_dhaka">Inside Dhaka (BDT)</Label>
                  <Input
                    id="inside_dhaka"
                    type="number"
                    value={settings.inside_dhaka_charge || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, inside_dhaka_charge: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="outside_dhaka">Outside Dhaka (BDT)</Label>
                  <Input
                    id="outside_dhaka"
                    type="number"
                    value={settings.outside_dhaka_charge || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, outside_dhaka_charge: e.target.value })
                    }
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pixel">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Pixel</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSavePixel} className="space-y-4">
                <div>
                  <Label htmlFor="pixel_id">Pixel ID</Label>
                  <Input
                    id="pixel_id"
                    value={settings.fb_pixel_id || ''}
                    onChange={(e) =>
                      setSettings({ ...settings, fb_pixel_id: e.target.value })
                    }
                    placeholder="Enter your Facebook Pixel ID"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="pixel_active"
                    checked={settings.fb_pixel_active || false}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, fb_pixel_active: checked })
                    }
                  />
                  <Label htmlFor="pixel_active">Enable Facebook Pixel</Label>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
