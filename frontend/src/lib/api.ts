const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://hello-universe-a63c.onrender.com");

export type PublicUser = {
  id: string;
  name: string;
  email: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price_inr: string;
  is_digital: boolean;
  download_url: string | null;
  image_url: string | null;
  active: boolean;
  created_at: string;
};

export type PaymentMethod = "upi" | "nowpayments";

export type Order = {
  id: string;
  user_id: string;
  product_id: string;
  amount_inr: string;
  status: "pending" | "success" | "failed";
  delivered: boolean;
  created_at: string;
  updated_at: string;

  payment_method: PaymentMethod;

  gateway_payment_id: string | null;
  gateway_pay_address: string | null;
  gateway_pay_currency: string | null;
  gateway_pay_amount: string | null;

  crypto_pay_address: string | null;
  crypto_expected_amount: string | null;
  crypto_tx_hash: string | null;
};

export type CreateOrderResponse = {
  order_id: string;
  payment_method: PaymentMethod;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("hu_token");
}

export function setToken(token: string) {
  window.localStorage.setItem("hu_token", token);
}

export function clearToken() {
  window.localStorage.removeItem("hu_token");
}

export function getStoredUser(): PublicUser | null {
  if (typeof window === "undefined") return null;
  try {
    const s = window.localStorage.getItem("hu_user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: PublicUser) {
  window.localStorage.setItem("hu_user", JSON.stringify(user));
}

export function clearStoredUser() {
  window.localStorage.removeItem("hu_user");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    profession: "student" | "working" | "creator" | "other",
  ) =>
    request<{ token: string; user: PublicUser }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, phone, address, profession }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: PublicUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  verifyOtp: (email: string, otpCode: string) =>
    request<{ success: boolean }>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp_code: otpCode }),
    }),

  resendOtp: (email: string) =>
    request<{ success: boolean }>("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  me: () => request<PublicUser>("/api/me"),

  listProducts: () => request<Product[]>("/api/products"),

  getProduct: (slug: string) => request<Product>(`/api/products/${slug}`),

  createUpiOrder: (productId: string) =>
    request<{ order_id: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, payment_method: "upi" }),
    }),

  myOrders: () => request<Order[]>("/api/orders"),

  getOrder: (orderId: string) => request<Order>(`/api/orders/${orderId}`),
};
