export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  tags: string[];
};

export type Lesson = {
  id: string;
  title: string;
  order: number;
  content: string;
  videoUrl?: string;
  codeSnippet?: string;
};

export type Solution = {
  id: string;
  title: string;
  slug: string;
  category: string;
  problemDescription: string;
  estimatedCost: string;
  softwareTools: string[];
  tags: string[];
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  stock: number;
  imageUrl?: string;
  tags: string[];
};

export type Guide = {
  id: string;
  title: string;
  slug: string;
  description: string;
  wiringImageUrl?: string;
  tags: string[];
};

export type CartItem = {
  id: string;
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: string;
    product: Product;
  }>;
};
