export interface WebsiteScan {
  id: string;
  name: string;
  domain: string;
  category: string;
  productsListed: number;
  priceRange: string;
  contactEmail: string;
  isOfficialEmail: boolean;
  socialComments: string[];
  riskScore: number;
  riskLevel: 'low' | 'elevated' | 'critical';
  riskMessage: string;
}

export const mockScans: WebsiteScan[] = [
  {
    id: '1',
    name: 'Northwind Kirana Retail',
    domain: 'northwindkirana.com',
    category: 'E-Commerce',
    productsListed: 120,
    priceRange: '₹50 - ₹1,500',
    contactEmail: 'support@northwindkirana.com',
    isOfficialEmail: true,
    socialComments: ['Fast delivery', 'Good quality staples.'],
    riskScore: 12,
    riskLevel: 'low',
    riskMessage: 'No website-level concerns detected.'
  },
  {
    id: '2',
    name: 'BluePeak Electronics',
    domain: 'bluepeakelectronics.in',
    category: 'E-Commerce',
    productsListed: 45,
    priceRange: '₹500 - ₹45,000',
    contactEmail: 'hello@bluepeakelectronics.in',
    isOfficialEmail: true,
    socialComments: ['Customer service is responsive.', 'Genuine products.'],
    riskScore: 8,
    riskLevel: 'low',
    riskMessage: 'No website-level concerns detected.'
  },
  {
    id: '3',
    name: 'Crestline Fashion Hub',
    domain: 'crestlinefashion.com',
    category: 'E-Commerce',
    productsListed: 320,
    priceRange: '₹200 - ₹4,000',
    contactEmail: 'contact@crestlinefashion.com',
    isOfficialEmail: true,
    socialComments: ['Trendy clothes.', 'Sizes run a bit small.'],
    riskScore: 15,
    riskLevel: 'low',
    riskMessage: 'No website-level concerns detected.'
  },
  {
    id: '4',
    name: 'Harbor Books & Stationery',
    domain: 'harborbooks.co.in',
    category: 'E-Commerce',
    productsListed: 500,
    priceRange: '₹30 - ₹2,000',
    contactEmail: 'info@harborbooks.co.in',
    isOfficialEmail: true,
    socialComments: ['Great collection of pens.', 'Books arrived in good condition.'],
    riskScore: 5,
    riskLevel: 'low',
    riskMessage: 'No website-level concerns detected.'
  },
  {
    id: '5',
    name: 'ShopKart Online Retail',
    domain: 'shopkart-deals-now.com',
    category: 'E-Commerce',
    productsListed: 2,
    priceRange: '₹50,000 - ₹1,50,000',
    contactEmail: 'shopkartdeals88@gmail.com',
    isOfficialEmail: false,
    socialComments: ['Is this a scam?', 'I never received my order.'],
    riskScore: 78,
    riskLevel: 'elevated',
    riskMessage: 'High-value items with free email domain. Unusually low product count for electronics.'
  },
  {
    id: '6',
    name: 'TrendBazaar Marketplace',
    domain: 'trendbazaarmarketplace.com',
    category: 'E-Commerce',
    productsListed: 3,
    priceRange: '₹873 - ₹2,249',
    contactEmail: 'support@trendbazaarmarketplace.com',
    isOfficialEmail: true,
    socialComments: ['Value for money.', 'Product matched the listing.'],
    riskScore: 0,
    riskLevel: 'low',
    riskMessage: 'No website-level concerns detected.'
  },
  {
    id: '7',
    name: 'Anchor Grocery Mart',
    domain: 'anchorgrocery-discount.net',
    category: 'Food & Quick Commerce',
    productsListed: 15,
    priceRange: '₹10 - ₹5,000',
    contactEmail: 'admin@anchorgrocery-discount.net',
    isOfficialEmail: true,
    socialComments: ['Some items were expired.', 'Delivery took 3 days.'],
    riskScore: 65,
    riskLevel: 'elevated',
    riskMessage: 'Elevated customer complaints regarding fulfillment. Monitor closely.'
  },
  {
    id: '8',
    name: 'QuickMart Grocery Express',
    domain: 'quickmartgrocery.in',
    category: 'Food & Quick Commerce',
    productsListed: 450,
    priceRange: '₹20 - ₹3,000',
    contactEmail: 'support@quickmartgrocery.in',
    isOfficialEmail: true,
    socialComments: ['Very quick delivery.', 'Fresh produce.'],
    riskScore: 10,
    riskLevel: 'low',
    riskMessage: 'No website-level concerns detected.'
  }
];
