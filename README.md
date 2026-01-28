# RastaLife a Fashion eCommerce Websites

A full-featured e-commerce platform for RastaLife, a Bangladeshi fashion clothing brand.

## Features

### Frontend Features
- Modern, responsive homepage with hero section, category browsing, and product showcases
- Product listing with filtering by category and conditions
- Detailed product pages with:
  - Image gallery with slider
  - Size and color selection
  - Countdown timer for limited-time offers
  - Add to cart and Buy Now functionality
- Shopping cart with quantity management
- Checkout process with coupon code support
- Order confirmation and thank you page
- Search functionality
- Mobile-friendly responsive design

### Admin Panel Features
- Secure admin login (credentials set via environment variables)
- Dashboard with key statistics (total products, orders, sales, etc.)
- Product management:
  - Add new products with multiple images
  - Edit existing products
  - Delete products
  - Set product status (published/draft)
  - Configure sizes, colors, categories, and conditions
  - Set time-limited offers
- Order management:
  - View all orders
  - Update order status (pending, approved, delivered, cancelled)
  - View detailed order information
- Settings:
  - Configure delivery charges for inside/outside Dhaka
  - Manage Facebook Pixel ID and activation

### Facebook Pixel Integration
- PageView tracking (automatic on all pages)
- ViewContent tracking (product pages)
- AddToCart tracking
- InitiateCheckout tracking
- Purchase tracking with hashed customer data

### Technical Features
- Built with Next.js 13 and TypeScript
- Styled with Tailwind CSS and shadcn/ui components
- Supabase backend for database and authentication
- Row Level Security (RLS) for data protection
- SEO-friendly with proper slugs and metadata
- Cart persistence with localStorage

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update with your Supabase credentials from your project settings

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Admin Setup

To set up admin access:

1. Set your admin password as an environment variable:
```bash
export ADMIN_PASSWORD=your_secure_password
```

2. Update the setup script to use the environment variable, then run it:
```bash
node scripts/setup-admin.js
```

3. This will generate a password hash that you can use in your Supabase database

### Security Note

⚠️ **IMPORTANT:** This repository should be kept secure. Never commit:
- Your `.env` file
- Admin passwords or credentials
- API keys or secrets
- Database credentials

All sensitive configuration must be managed via environment variables.

### Building for Production

```bash
npm run build
npm run start
```

## Admin Access

- URL: `/admin/login`
- Credentials are set during initial setup using environment variables
- See "Admin Setup" section below for configuration instructions

## Database Schema

The application uses the following main tables:
- `products` - Product catalog
- `orders` - Customer orders
- `admin_users` - Admin authentication
- `settings` - Site configuration
- `size_charts` - Size chart definitions
- `coupons` - Discount coupons
- `fb_pixel_settings` - Facebook Pixel configuration

## Key Pages

### Public Pages
- `/` - Homepage
- `/products` - All products
- `/products/[slug]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/thank-you` - Order confirmation
- `/search` - Search results
- `/about` - About us
- `/contact` - Contact information
- `/return-policy` - Return policy

### Admin Pages
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/products/new` - Add new product
- `/admin/orders` - Order management
- `/admin/settings` - Site settings

## Product Categories

1. Half Sleeve Blank T-Shirt
2. Half Sleeve Design T-Shirt
3. Half Sleeve Reglan T-Shirt
4. Half Sleeve Blank Drop Shoulder T-Shirts

## Product Conditions

1. Top Selling
2. New Arrivals
3. Free Delivery
4. Stock Clearance

## Adding Products

When adding products through the admin panel:
1. Product images should be hosted URLs (e.g., from image hosting services)
2. Sizes should be comma-separated (e.g., S, M, L, XL)
3. Colors can be single or multiple selection
4. Slugs are auto-generated from titles if left empty
5. Offer end dates create countdown timers on product pages

## Delivery Charges

Default charges (configurable in admin settings):
- Inside Dhaka: ৳60
- Outside Dhaka: ৳100

## Facebook Pixel Setup

1. Go to Admin > Settings > Facebook Pixel
2. Enter your Facebook Pixel ID
3. Enable the pixel
4. Events tracked:
   - PageView
   - ViewContent
   - AddToCart
   - InitiateCheckout
   - Purchase (with hashed customer data)

## Support

For any issues or questions, contact:
- Email: info@yourmail.com
- Phone: +880 1XXX-XXXXXX

## License

© 2026 RastaLife. All rights reserved.
