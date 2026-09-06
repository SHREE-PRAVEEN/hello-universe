const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

export type PaymentMethod = "payu" | "nowpayments" | "usdt_trc20";

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

  payu_txnid: string | null;
  payu_mihpayid: string | null;

  gateway_payment_id: string | null;
  gateway_pay_address: string | null;
  gateway_pay_currency: string | null;
  gateway_pay_amount: string | null;

  crypto_pay_address: string | null;
  crypto_expected_amount: string | null;
  crypto_tx_hash: string | null;
};

export type PayUPaymentParams = {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  action_url: string;
};

export type CryptoPaymentInfo = {
  pay_address: string;
  pay_amount: string;
  pay_currency: string;
  expires_in_seconds: number | null;
};

export type CreateOrderResponse = {
  order_id: string;
  payment_method: PaymentMethod;
  payu: PayUPaymentParams | null;
  crypto: CryptoPaymentInfo | null;
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
  signup: (name: string, email: string, password: string) =>
    request<{ token: string; user: PublicUser }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: PublicUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<PublicUser>("/api/me"),

  listProducts: () => request<Product[]>("/api/products"),

  getProduct: (slug: string) => request<Product>(`/api/products/${slug}`),

  createOrder: (productId: string, paymentMethod: PaymentMethod) =>
    request<CreateOrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, payment_method: paymentMethod }),
    }),

  myOrders: () => request<Order[]>("/api/orders"),

  getOrder: (orderId: string) => request<Order>(`/api/orders/${orderId}`),

  /// Manually nudges the backend to check a self-hosted USDT-TRC20 order
  /// against the blockchain right now, instead of waiting for the ~20s
  /// background poll.
  checkCryptoPayment: (orderId: string) =>
    request<Order>(`/api/orders/${orderId}/check-crypto`, { method: "POST" }),
};
