/**
 * Type declarations for Barber Classic 76 Studio
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: 'corte' | 'barba' | 'combo' | 'especial';
  featured: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  badge?: string; // e.g. "Cliente Frecuente", "Local Guide"
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: 'corte' | 'barba' | 'local' | 'estilo';
}

export interface Schedule {
  day: string;
  hours: string;
  isClosed: boolean;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  dateTime: string;
  services: Service[];
  totalPrice: number;
  status: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada';
  createdAt: string;
}

export interface ContactInfo {
  name: string;
  address: string;
  phone: string;
  phoneFormatted: string;
  whatsappMessageUrl: string;
  ratingValue: number;
  ratingCount: number;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
}
