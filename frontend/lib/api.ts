import type { ApiResponse, Course, Guide, Order, Product, Solution } from "@/types";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getAuthHeader = () => {
  if (typeof window === "undefined") return {} as Record<string, string>;
  const token = localStorage.getItem("hu_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${baseURL}${endpoint}`;
  const authHeaders = getAuthHeader();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authHeaders.Authorization) {
    headers.Authorization = authHeaders.Authorization;
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
};

export const apiClient = {
  async register(payload: { name: string; email: string; password: string }) {
    const data = await fetchApi<ApiResponse<{ user: unknown; token: string }>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  },
  async login(payload: { email: string; password: string }) {
    const data = await fetchApi<ApiResponse<{ user: unknown; token: string }>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  },
  async getCourses(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const data = await fetchApi<ApiResponse<Course[]>>(`/courses${query}`);
    return data.data;
  },
  async getCourse(slug: string) {
    const data = await fetchApi<ApiResponse<Course & { lessons: unknown[] }>>(`/courses/${slug}`);
    return data.data;
  },
  async getSolutions(params?: { category?: string; search?: string; tag?: string }) {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.tag) q.set("tag", params.tag);
    const query = q.toString() ? `?${q.toString()}` : "";
    const data = await fetchApi<ApiResponse<Solution[]>>(`/solutions${query}`);
    return data.data;
  },
  async getSolution(slug: string) {
    const data = await fetchApi<ApiResponse<Solution>>(`/solutions/${slug}`);
    return data.data;
  },
  async getProducts(params?: { category?: string; search?: string; tag?: string }) {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    if (params?.tag) q.set("tag", params.tag);
    const query = q.toString() ? `?${q.toString()}` : "";
    const data = await fetchApi<ApiResponse<Product[]>>(`/products${query}`);
    return data.data;
  },
  async getProduct(slug: string) {
    const data = await fetchApi<ApiResponse<Product & { reviews?: unknown[] }>>(`/products/${slug}`);
    return data.data;
  },
  async addToCart(payload: { productId: string; quantity: number }) {
    const data = await fetchApi<ApiResponse<unknown>>("/products/cart/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  },
  async addReview(productId: string, payload: { rating: number; comment?: string }) {
    const data = await fetchApi<ApiResponse<unknown>>(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  },
  async getGuides(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const data = await fetchApi<ApiResponse<Guide[]>>(`/guides${query}`);
    return data.data;
  },
  async getCart() {
    const data = await fetchApi<ApiResponse<{ items: unknown[] }>>("/products/cart/me");
    return data.data;
  },
  async createOrder(payload: { items: Array<{ productId: string; quantity: number }> }) {
    const data = await fetchApi<ApiResponse<unknown>>("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  },
  async getOrders() {
    const data = await fetchApi<ApiResponse<Order[]>>("/orders/me");
    return data.data;
  },
  async recommendRobot(payload: { budget: number; useCase: string }) {
    const data = await fetchApi<ApiResponse<unknown>>("/configurator/recommend", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return data.data;
  },
};
