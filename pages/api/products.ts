import type { NextApiRequest, NextApiResponse } from 'next';

// Product name templates for variety
const productNames = [
  'Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'Mechanical Keyboard', 'USB-C Hub',
  'Gaming Mouse', 'Webcam HD', 'Monitor Stand', 'Desk Mat', 'Cable Organizer',
  'Phone Stand', 'Tablet Holder', 'Speaker System', 'Microphone USB', 'Headset Stand',
  'LED Strip Lights', 'Power Bank', 'Wireless Charger', 'Car Mount', 'Tripod',
  'Bluetooth Speaker', 'Earbuds Pro', 'Smart Ring', 'Fitness Tracker', 'VR Headset',
  'Action Camera', 'Drone Mini', 'Smart Bulb', 'Thermostat', 'Security Camera',
  'Smart Lock', 'Doorbell Camera', 'Robot Vacuum', 'Air Purifier', 'Humidifier',
  'Standing Desk', 'Ergonomic Chair', 'Foot Rest', 'Wrist Rest', 'Monitor Light',
  'USB Hub', 'SD Card Reader', 'External SSD', 'HDMI Cable', 'Ethernet Cable',
  'Adapter USB-C', 'Docking Station', 'Laptop Sleeve', 'Backpack Tech', 'Briefcase',
  'Notebook Stand', 'Pen Holder', 'Desk Lamp', 'Monitor Arm', 'Keyboard Tray',
  'Mouse Pad', 'Wrist Support', 'Back Support', 'Eye Glasses', 'Blue Light Filter',
  'Screen Protector', 'Laptop Cooler', 'Fan USB', 'Heater Desk', 'Humidifier Mini',
  'Plant Pot Smart', 'Clock Digital', 'Calendar Wall', 'Whiteboard', 'Cork Board',
  'Desk Organizer', 'Drawer Organizer', 'File Holder', 'Book Stand', 'Magazine Rack',
  'Cable Sleeve', 'Cable Clips', 'Velcro Ties', 'Cable Box', 'Outlet Cover',
  'Extension Cord', 'Surge Protector', 'Power Strip', 'Battery Pack', 'Solar Charger',
  'Car Charger', 'Wall Charger', 'Wireless Pad', 'Magnetic Mount', 'Car Holder',
  'Bike Mount', 'Helmet Mount', 'Gimbal Stabilizer', 'Selfie Stick', 'Monopod',
  'Camera Bag', 'Lens Cleaner', 'Memory Card', 'External Drive', 'Cloud Storage',
  'VPN Router', 'Mesh System', 'Range Extender', 'Ethernet Switch', 'Modem Router'
];

const categories = [
  'Electronics', 'Accessories', 'Computers', 'Audio', 'Video', 'Photography',
  'Smart Home', 'Office', 'Gaming', 'Mobile', 'Wearables', 'Storage', 'Networking'
];

const adjectives = [
  'Premium', 'Pro', 'Ultra', 'Elite', 'Advanced', 'Professional', 'High-End',
  'Deluxe', 'Luxury', 'Standard', 'Basic', 'Essential', 'Compact', 'Portable',
  'Wireless', 'Smart', 'Digital', 'HD', '4K', 'RGB', 'Ergonomic', 'Gaming'
];

const features = [
  'noise-cancelling', 'waterproof', 'wireless charging', 'bluetooth 5.0', 'USB-C',
  'fast charging', '4K resolution', 'HDR support', 'RGB lighting', 'mechanical switches',
  'ergonomic design', 'adjustable height', 'tilt function', 'swivel base', 'cable management',
  'portable', 'compact', 'lightweight', 'durable', 'premium materials', 'aluminum build',
  'carbon fiber', 'leather finish', 'wood grain', 'matte black', 'silver finish'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomPrice(min: number = 9.99, max: number = 999.99): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateRandomProduct(id: number) {
  const nameBase = getRandomElement(productNames);
  const adjective = Math.random() > 0.5 ? getRandomElement(adjectives) : '';
  const name = adjective ? `${adjective} ${nameBase}` : nameBase;
  const category = getRandomElement(categories);
  const price = getRandomPrice();
  const feature = getRandomElement(features);
  const description = `High-quality ${name.toLowerCase()} with ${feature} technology. Perfect for modern needs.`;

  return {
    id,
    name,
    price,
    description,
    category,
  };
}

type Data = {
  products: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
  }>;
  generatedAt: string;
  count: number;
  totalPool: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Generate 100 random products (pool)
  const allProducts = Array.from({ length: 100 }, (_, i) => generateRandomProduct(i + 1));
  
  // Shuffle the array to make it more random
  for (let i = allProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
  }

  // Return only 5 random products from the pool
  // Each API call will return different random 5 products
  const selectedIndices = new Set<number>();
  while (selectedIndices.size < 5) {
    selectedIndices.add(Math.floor(Math.random() * allProducts.length));
  }
  
  const products = Array.from(selectedIndices).map(index => allProducts[index]);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 50));

  res.status(200).json({
    products,
    generatedAt: new Date().toISOString(),
    count: products.length,
    totalPool: allProducts.length,
  });
}

