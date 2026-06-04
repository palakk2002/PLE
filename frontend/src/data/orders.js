import { products } from "./products";

// Generate a random date within the last 30 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString();
};

// Get random products for an order
const getRandomOrderItems = (count) => {
  const shuffled = [...products].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((product) => ({
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: Math.floor(Math.random() * 3) + 1,
    image: product.image,
    variant: product.variants?.defaultVariant || undefined,
  }));
};

// Get vendor items for an order
const getVendorItems = (items) => {
  const vendorMap = {};
  items.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) {
      const vendorId = String(product.vendorId);
      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = {
          vendorId,
          vendorName: product.vendorName || "Unknown Vendor",
          items: [],
        };
      }
      vendorMap[vendorId].items.push(item);
    }
  });
  return Object.values(vendorMap);
};

// Order status options
const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

// Generate mock orders
export const mockOrders = [
  {
    id: "ORD-001",
    userId: "buyer_mock_12345",
    date: getRandomDate(),
    status: "delivered",
    total: 249.96,
    items: getRandomOrderItems(3),
    vendorItems: [],
  },
  {
    id: "ORD-002",
    userId: "buyer_mock_12345",
    date: getRandomDate(),
    status: "shipped",
    total: 129.99,
    items: getRandomOrderItems(2),
    vendorItems: [],
  },
  {
    id: "ORD-003",
    userId: "buyer_mock_12345",
    date: getRandomDate(),
    status: "processing",
    total: 349.97,
    items: getRandomOrderItems(4),
    vendorItems: [],
  },
  {
    id: "ORD-004",
    userId: "buyer_mock_12345",
    date: getRandomDate(),
    status: "pending",
    total: 89.99,
    items: getRandomOrderItems(1),
    vendorItems: [],
  },
  {
    id: "ORD-005",
    userId: "buyer_mock_12345",
    date: getRandomDate(),
    status: "cancelled",
    total: 179.98,
    items: getRandomOrderItems(2),
    vendorItems: [],
  },
  {
    id: "ORD-006",
    userId: "buyer_mock_12345",
    date: getRandomDate(),
    status: "delivered",
    total: 549.95,
    items: getRandomOrderItems(5),
    vendorItems: [],
  },
].map((order) => ({
  ...order,
  vendorItems: getVendorItems(order.items),
  total: order.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));

export default mockOrders;
