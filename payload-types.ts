export interface Config {
  collections: {
    users: User;
    products: Product;
    categories: Category;
    reservations: Reservation;
    media: Media;
  };
  globals: Record<string, never>;
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: "admin" | "customer";
  reservations?: (string | Reservation)[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug?: string | null;
  description?: unknown;
  price: number;
  images?: { image: string | Media; id?: string | null }[] | null;
  category?: string | Category | null;
  availableSlots: number;
  isActive?: boolean | null;
  reservationDuration?: number | null;
  meta?: { title?: string | null; description?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  image?: string | Media | null;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  id: string;
  user: string | User;
  product: string | Product;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reservedFrom: string;
  reservedTo: string;
  quantity: number;
  notes?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  alt?: string | null;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  createdAt: string;
  updatedAt: string;
}
