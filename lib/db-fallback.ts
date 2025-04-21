/**
 * Simple DB Fallback System
 * For portfolio demonstration purposes only
 */

import { PrismaClient } from "@prisma/client";

// Mock pre-populated data
const mockDatabase = {
  store: [
    {
      id: "demo-store-1",
      name: "Demo Fashion Store",
      userId: "demo-user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  billboard: [
    {
      id: "demo-billboard-1",
      label: "Summer Collection",
      imageUrl:
        "https://images.unsplash.com/photo-1555529771-7888783a18d3?q=80&w=2787&auto=format&fit=crop",
      storeId: "demo-store-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "demo-billboard-2",
      label: "New Arrivals",
      imageUrl:
        "https://images.unsplash.com/photo-1519748771451-a94c596fad67?q=80&w=2940&auto=format&fit=crop",
      storeId: "demo-store-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  category: [
    {
      id: "demo-category-1",
      name: "T-Shirts",
      storeId: "demo-store-1",
      billboardId: "demo-billboard-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "demo-category-2",
      name: "Shoes",
      storeId: "demo-store-1",
      billboardId: "demo-billboard-2",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  size: [
    {
      id: "demo-size-1",
      name: "Small",
      value: "s",
      storeId: "demo-store-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "demo-size-2",
      name: "Medium",
      value: "m",
      storeId: "demo-store-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  color: [
    {
      id: "demo-color-1",
      name: "Black",
      value: "#000000",
      storeId: "demo-store-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "demo-color-2",
      name: "White",
      value: "#FFFFFF",
      storeId: "demo-store-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  product: [
    {
      id: "demo-product-1",
      name: "Basic T-Shirt",
      price: "29.99",
      isFeatured: true,
      isArchived: false,
      storeId: "demo-store-1",
      categoryId: "demo-category-1",
      sizeId: "demo-size-2",
      colorId: "demo-color-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  image: [
    {
      id: "demo-image-1",
      productId: "demo-product-1",
      url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  order: [
    {
      id: "demo-order-1",
      storeId: "demo-store-1",
      isPaid: true,
      phone: "+1234567890",
      address: "123 Demo Street",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  orderItem: [
    {
      id: "demo-order-item-1",
      orderId: "demo-order-1",
      productId: "demo-product-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

// Create a fallback database object that mimics Prisma's API
const createDbFallback = () => {
  console.warn("Using fallback database for portfolio demonstration");

  // Generic operations that will be shared across all model types
  const createModelOperations = (modelName) => ({
    findMany: async (args) => {
      console.log(`Mock DB: ${modelName}.findMany`, args);
      const results = [...mockDatabase[modelName]];

      // Basic filtering by where clause
      if (args?.where) {
        return results.filter((item) => {
          return Object.entries(args.where).every(([key, value]) => {
            return item[key] === value;
          });
        });
      }

      return results;
    },

    findFirst: async (args) => {
      console.log(`Mock DB: ${modelName}.findFirst`, args);
      const results = [...mockDatabase[modelName]];

      // Basic filtering by where clause
      if (args?.where) {
        return (
          results.find((item) => {
            return Object.entries(args.where).every(([key, value]) => {
              return item[key] === value;
            });
          }) || null
        );
      }

      return results[0] || null;
    },

    findUnique: async (args) => {
      console.log(`Mock DB: ${modelName}.findUnique`, args);
      if (args?.where?.id) {
        return (
          mockDatabase[modelName].find((item) => item.id === args.where.id) ||
          null
        );
      }
      return null;
    },

    create: async (args) => {
      console.log(`Mock DB: ${modelName}.create`, args);
      const newItem = {
        ...args.data,
        id: args.data.id || `mock-${modelName}-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDatabase[modelName].push(newItem);
      return newItem;
    },

    update: async (args) => {
      console.log(`Mock DB: ${modelName}.update`, args);
      const index = mockDatabase[modelName].findIndex(
        (item) => item.id === args.where.id
      );
      if (index === -1) {
        throw new Error(`Record with ID ${args.where.id} not found`);
      }

      const updatedItem = {
        ...mockDatabase[modelName][index],
        ...args.data,
        updatedAt: new Date(),
      };

      mockDatabase[modelName][index] = updatedItem;
      return updatedItem;
    },

    delete: async (args) => {
      console.log(`Mock DB: ${modelName}.delete`, args);
      const index = mockDatabase[modelName].findIndex(
        (item) => item.id === args.where.id
      );
      if (index === -1) {
        throw new Error(`Record with ID ${args.where.id} not found`);
      }

      const deletedItem = mockDatabase[modelName][index];
      mockDatabase[modelName].splice(index, 1);
      return deletedItem;
    },

    count: async (args) => {
      console.log(`Mock DB: ${modelName}.count`, args);

      if (args?.where) {
        return mockDatabase[modelName].filter((item) => {
          return Object.entries(args.where).every(([key, value]) => {
            return item[key] === value;
          });
        }).length;
      }

      return mockDatabase[modelName].length;
    },
  });

  // Create a client with operations for each model
  return {
    store: createModelOperations("store"),
    billboard: createModelOperations("billboard"),
    category: createModelOperations("category"),
    size: createModelOperations("size"),
    color: createModelOperations("color"),
    product: createModelOperations("product"),
    image: createModelOperations("image"),
    order: createModelOperations("order"),
    orderItem: createModelOperations("orderItem"),

    // Other Prisma client methods/properties that might be used
    $disconnect: async () => {},
    $connect: async () => {},
  };
};

// Export a singleton instance
export default createDbFallback();
