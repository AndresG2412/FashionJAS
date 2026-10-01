// ─── Datos mock para el home premium de FashionJAS ────────────────────────────
// Están claramente estructurados para facilitar la conexión posterior con la API.

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

export const announcementMessages = [
  "Envíos a toda Colombia 🇨🇴",
  "Nuevos ingresos cada semana",
  "Compra 100% segura",
];

// ─── Categorías (grid asimétrico) ─────────────────────────────────────────────
export interface HomeCategory {
  title: string;
  slug: string;
  image: string;
  tagline: string;
  featured?: boolean;
}

export const homeCategories: HomeCategory[] = [
  {
    title: "Vestidos",
    slug: "vestidos",
    image: img("photo-1496747611176-843222e1e57c"),
    tagline: "Elegancia para cada ocasión",
    featured: true,
  },
  {
    title: "Blusas Top",
    slug: "blusas-top-tirantes",
    image: img("photo-1516762689617-e1cffcef479d"),
    tagline: "Frescas y versátiles",
  },
  {
    title: "Jeans Bota Ancha",
    slug: "jean-bota-campana",
    image: img("photo-1541099649105-f69ad21f3246"),
    tagline: "Actitud y comodidad",
  },
  {
    title: "Jeans Bota Recta",
    slug: "jean-bota-recta",
    image: img("photo-1487222477894-8943e31ef7b2"),
    tagline: "El clásico reinventado",
  },
  {
    title: "Gimnasio",
    slug: "gimnasio",
    image: img("photo-1517836357463-d25dfeac3438"),
    tagline: "Energía para tu día",
  },
];

// ─── Productos destacados (mock) ──────────────────────────────────────────────
export interface MockProduct {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  imagenes: string[];
  descripcion: string;
  categorias: string[];
  stock: number;
  tallas?: string[];
  colores?: string[];
  tag: "Nuevo" | "Más vendido" | "Últimas unidades";
}

export const featuredProducts: MockProduct[] = [
  {
    id: "mock-1",
    nombre: "Blusa Top Satinada Crepé",
    slug: "blusa-top-satinada-crepe",
    precio: 49900,
    imagenes: [img("photo-1509631179647-0177331693ae")],
    descripcion: "Blusa top satinada con caída elegante, ideal para looks de día y noche.",
    categorias: ["blusas-top-tirantes"],
    stock: 12,
    tallas: ["S", "M", "L"],
    colores: ["Rosa", "Crema"],
    tag: "Nuevo",
  },
  {
    id: "mock-2",
    nombre: "Jean Bota Ancha High Waist",
    slug: "jean-bota-ancha-high-waist",
    precio: 89900,
    imagenes: [img("photo-1541099649105-f69ad21f3246")],
    descripcion: "Jeans bota ancha tiro alto, denim elástico que realza la silueta.",
    categorias: ["jean-bota-campana"],
    stock: 8,
    tallas: ["26", "28", "30"],
    colores: ["Azul claro"],
    tag: "Más vendido",
  },
  {
    id: "mock-3",
    nombre: "Vestido Largo Floral",
    slug: "vestido-largo-floral",
    precio: 129900,
    imagenes: [img("photo-1496747611176-843222e1e57c")],
    descripcion: "Vestido largo estampado floral, corte romántico y fresco.",
    categorias: ["vestidos"],
    stock: 5,
    tallas: ["S", "M", "L"],
    colores: ["Multicolor"],
    tag: "Últimas unidades",
  },
  {
    id: "mock-4",
    nombre: "Jeans Bota Recta Clásico",
    slug: "jeans-bota-recta-clasico",
    precio: 79900,
    imagenes: [img("photo-1487222477894-8943e31ef7b2")],
    descripcion: "Jeans bota recta de corte limpio, el esencial de todo guardarropa.",
    categorias: ["jean-bota-recta"],
    stock: 20,
    tallas: ["26", "28", "30", "32"],
    colores: ["Azul", "Negro"],
    tag: "Nuevo",
  },
];

// ─── Beneficios ───────────────────────────────────────────────────────────────
export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: "Truck",
    title: "Envíos a toda Colombia",
    description: "Recibe tus prendas en la puerta de tu casa, a donde estés.",
  },
  {
    icon: "ShieldCheck",
    title: "Compra 100% segura",
    description: "Pagos protegidos y datos personales siempre resguardados.",
  },
  {
    icon: "HeartHandshake",
    title: "Atención personalizada",
    description: "Te asesoramos por WhatsApp para que elijas perfecto.",
  },
  {
    icon: "Sparkles",
    title: "Tendencias para ti",
    description: "Selección de prendas que siguen la moda de temporada.",
  },
];

// ─── Banner editorial de campaña ──────────────────────────────────────────────
export const campaign = {
  kicker: "Nueva colección",
  title: "Looks que hablan por ti",
  description:
    "Descubre prendas esenciales para crear combinaciones auténticas y llenas de personalidad.",
  image: img("photo-1515886657613-9f3515b0c78f"),
  stats: [
    { value: "500+", label: "Clientas felices" },
    { value: "5", label: "Categorías" },
    { value: "100%", label: "Calidad" },
  ],
};

// ─── Looks "Arma tu outfit" ───────────────────────────────────────────────────
export interface Look {
  title: string;
  mood: string;
  image: string;
  categorySlug: string;
}

export const looks: Look[] = [
  {
    title: "Casual Urbano",
    mood: "Blusa top + jeans bota ancha",
    image: img("photo-1529139574466-a303027c1d8b"),
    categorySlug: "blusas-top-tirantes",
  },
  {
    title: "Elegante y Femenino",
    mood: "Vestido + accesorios dorados",
    image: img("photo-1490481651871-ab68de25d43d"),
    categorySlug: "vestidos",
  },
  {
    title: "Actitud Denim",
    mood: "Jeans bota recta + crop top",
    image: img("photo-1524504388940-b1c1722653e1"),
    categorySlug: "jean-bota-recta",
  },
];

// ─── Testimonios ──────────────────────────────────────────────────────────────
export interface Testimonial {
  name: string;
  city: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: "María Fernanda",
    city: "Mocoa, Putumayo",
    text: "La calidad es increíble y me llegó rapidísimo. Ya pedí dos veces y siempre quedo encantada.",
    rating: 5,
  },
  {
    name: "Laura Camila",
    city: "Pasto, Nariño",
    text: "Los vestidos son hermosos y el precio súper justo. Me encanta que siempre están pendientes por WhatsApp.",
    rating: 5,
  },
  {
    name: "Daniela Rojas",
    city: "Bogotá",
    text: "El jean bota ancha es mi favorito, la tela es súper cómoda. Sin duda repetiré.",
    rating: 4,
  },
];

// ─── Sellos de confianza ──────────────────────────────────────────────────────
export const trustBadges = [
  "Atendemos por WhatsApp",
  "Compra protegida",
  "Envíos nacionales",
  "Pago seguro",
];

// ─── Contacto y enlaces del footer ────────────────────────────────────────────
export const footerContact = {
  whatsapp: "https://wa.me/573126248617",
  whatsappLabel: "+57 312 624 8617",
  email: "Fashionjasoficial@gmail.com",
  location: "Mocoa, Putumayo, Colombia",
  schedule: "Lun - Sáb: 8:00 AM - 5:00 PM",
};

export const paymentMethods = ["PSE", "Tarjeta", "Nequi", "Daviplata", "Efecty"];
