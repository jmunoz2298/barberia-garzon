import { Service, Review, GalleryItem, Schedule, ContactInfo } from './types';

export const CONTACT_INFO: ContactInfo = {
  name: "Barber Classic 76 Studio",
  address: "Cra. 7 #6-04, Garzón, Huila, Colombia",
  phone: "+57 321 909 8303",
  phoneFormatted: "3219098303",
  whatsappMessageUrl: "https://wa.me/573219098303?text=Hola%20Barber%20Classic%2076%20Studio%2C%20me%20gustar%C3%ADa%20reservar%20una%20cita%20de%20barber%C3%ADa...",
  ratingValue: 5.0,
  ratingCount: 48,
  // Google Maps Embed URL for "Cra. 7 #6-04, Garzón, Huila". Let's use a verified address embed
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.63435133604!2d-75.629398!3d2.196924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3b48df080ef82d%3a0x2863ca3e51fe942e!2sCra.%207%20%236-04%2C%20Garz%C3%B3n%2C%20Huila%2C%20Colombia!5e0!3m2!1ses!2sco!4v1717521000000!5m2!1ses!2sco",
  googleMapsDirectionsUrl: "https://maps.google.com/?q=Cra.+7+%236-04,+Garz%C3%B3n,+Huila,+Colombia"
};

export const SERVICES: Service[] = [
  {
    id: "1",
    name: "Corte Clásico Premium",
    description: "Corte tradicional a tijera o máquina estructurado, peinado con pomada premium, masaje capilar relajante y lavado final.",
    price: "$20.000 COP",
    duration: "35 min",
    category: "corte",
    featured: true
  },
  {
    id: "2",
    name: "Corte Moderno / Fade",
    description: "Degradados de alta precisión (Low, Mid, High Fade), texturizado moderno, diseño personalizado y peinado con cera mate.",
    price: "$25.000 COP",
    duration: "45 min",
    category: "corte",
    featured: true
  },
  {
    id: "3",
    name: "Perfilado de Barba de Autor",
    description: "Marcación impecable de líneas con navaja libre, rebajado simétrico y alineación perfecta adaptada a tus facciones.",
    price: "$15.000 COP",
    duration: "25 min",
    category: "barba",
    featured: true
  },
  {
    id: "4",
    name: "Acondicionamiento de Barba",
    description: "Tratamiento completo con toalla caliente, aceites esenciales hidratantes premium, bálsamo suavizante y masaje estimulante.",
    price: "$18.000 COP",
    duration: "30 min",
    category: "barba",
    featured: true
  },
  {
    id: "5",
    name: "Diseño de Estilo Studio 76",
    description: "Asesoría completa de visagismo, corte premium personalizado, perfilado completo de cejas, barba y mascarilla negra purificante.",
    price: "$45.000 COP",
    duration: "70 min",
    category: "especial",
    featured: true
  },
  {
    id: "6",
    name: "Combo Real (Corte + Barba)",
    description: "La combinación definitiva de la casa. Corte moderno o clásico más arreglo completo de barba con toalla caliente.",
    price: "$35.000 COP",
    duration: "60 min",
    category: "combo",
    featured: true
  }
];

export const REVIEWS: Review[] = [
  {
    id: "1",
    author: "Carlos Andrés Silva",
    rating: 5,
    text: "Excelente servicio. Se nota el profesionalismo en cada corte, dedican el tiempo necesario y cuidan cada detalle.",
    date: "Hace 2 semanas",
    badge: "Cliente Frecuente"
  },
  {
    id: "2",
    author: "Humberto Restrepo",
    rating: 5,
    text: "Muy buena atención por parte de todo el equipo. El ambiente del lugar es inigualable en Garzón.",
    date: "Hace 1 mes",
    badge: "Local Guide"
  },
  {
    id: "3",
    author: "Felipe Medina Espinel",
    rating: 5,
    text: "Excelente higiene en todos sus implementos y toallas. Me generó muchísima confianza desde el primer momento.",
    date: "Hace 3 semanas",
    badge: "Cliente Verificado"
  },
  {
    id: "4",
    author: "Diego Torres",
    rating: 5,
    text: "Lugar agradable. Muy buena música, café de cortesía premium de Huila y el corte quedó perfecto.",
    date: "Hace 5 días",
    badge: "Usuario de Google"
  },
  {
    id: "5",
    author: "Santiago Sterling",
    rating: 5,
    text: "Muy recomendado el servicio de acondicionamiento de barba. Es toda una experiencia relajante con toalla húmeda caliente.",
    date: "Hace 1 semana",
    badge: "Cliente Frecuente"
  },
  {
    id: "6",
    author: "Andrés Mauricio Claros",
    rating: 5,
    text: "Un estudio increíble. La atención es de primera categoría y los implementos están esterilizados. No los cambio por nada.",
    date: "Hace 1 mes",
    badge: "Cliente Verificado"
  }
];

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
    title: "Corte Fade de Máxima Precisión",
    category: "corte"
  },
  {
    id: "g2",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
    title: "Ritual Tradicional de Barba",
    category: "barba"
  },
  {
    id: "g3",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
    title: "Nuestras Instalaciones Premium",
    category: "local"
  },
  {
    id: "g4",
    imageUrl: "https://images.unsplash.com/photo-1605497746444-ac9db453f4a6?auto=format&fit=crop&q=80&w=800",
    title: "Estilo y Perfilado de Navaja",
    category: "estilo"
  },
  {
    id: "g5",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800",
    title: "Peinado de Época y Acabado",
    category: "corte"
  },
  {
    id: "g6",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=800",
    title: "Tratamiento e Hidratación de Barba",
    category: "barba"
  }
];

export const SCHEDULES: Schedule[] = [
  { day: "Lunes", hours: "8:00 AM - 8:00 PM", isClosed: false },
  { day: "Martes", hours: "8:00 AM - 8:00 PM", isClosed: false },
  { day: "Miércoles", hours: "8:00 AM - 8:00 PM", isClosed: false },
  { day: "Jueves", hours: "8:00 AM - 8:00 PM", isClosed: false },
  { day: "Viernes", hours: "8:00 AM - 8:30 PM", isClosed: false },
  { day: "Sábado", hours: "8:00 AM - 9:00 PM", isClosed: false },
  { day: "Domingo", hours: "9:00 AM - 2:00 PM", isClosed: false }
];
