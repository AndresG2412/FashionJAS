"use client";

import React, { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import Link from "next/link";
import {
  Info,
  Phone,
  FileText,
  Shield,
  HelpCircle,
  LifeBuoy,
  ChevronRight,
  Smartphone,
  Tablet,
  Zap,
  Wind,
  WashingMachine,
  UtensilsCrossed,
  Headphones,
  ArrowUp,
} from "lucide-react";

/* ── Tipos ── */
type Section = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

/* ── Índice lateral ── */
const quickSections: Section[] = [
  { id: "sobre-nosotros", label: "Sobre nosotros", icon: <Info size={15} /> },
  { id: "contactanos", label: "Contáctanos", icon: <Phone size={15} /> },
  { id: "terminos", label: "Términos y condiciones", icon: <FileText size={15} /> },
  { id: "politicas", label: "Política de privacidad", icon: <Shield size={15} /> },
  { id: "faqs", label: "Preguntas frecuentes", icon: <HelpCircle size={15} /> },
  { id: "ayuda", label: "Ayuda", icon: <LifeBuoy size={15} /> },
];

/* ── FAQs ── */
const faqs = [
  { q: "¿Cuánto tarda el envío?", a: "Los envíos estándar tardan entre 3 y 5 días hábiles. Los envíos express llegan en 24-48 horas dentro de las ciudades principales." },
  { q: "¿Puedo devolver un producto?", a: "Sí, tienes 30 días desde la fecha de recepción para solicitar una devolución, siempre que el producto esté en su estado original." },
  { q: "¿Los productos tienen garantía?", a: "Todos nuestros productos cuentan con garantía de fábrica. La duración varía según el producto y el fabricante." },
  { q: "¿Puedo pagar contra entrega?", a: "Actualmente manejamos pagos en línea a través de nuestra pasarela segura Wompi. No manejamos pago contra entrega." },
  { q: "¿Hacen envíos a todo Colombia?", a: "No, hacemos envíos dentro de Cali. El costo y tiempo de entrega varían dependiendo de la localidad." },
];

/* ── Componente de sección con scroll suave ── */
const SectionBlock = ({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-danashop-textSecondary/20">
      <span className="p-2 rounded-lg bg-bgForms/30 text-danashop-brandSoft">{icon}</span>
      <h2 className="text-lg font-bold text-danashop-textPrimary tracking-wide">{title}</h2>
    </div>
    {children}
  </section>
);

/* ── Componente principal ── */
const page = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Detectar sección activa
      const ids = quickSections.map((s) => s.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-danashop-colorMain">
      {/* Hero */}
      <div className="bg-danashop-bgColorCard border-b border-danashop-textSecondary/20 py-10">
        <Container>
          <p className="text-sm font-bold uppercase tracking-widest text-danashop-brandSoft mb-2">Información</p>
          <h1 className="text-3xl font-extrabold text-danashop-textPrimary mb-2">Centro de Información</h1>
          <p className="text-danashop-textSecondary text-base max-w-xl">
            Todo lo que necesitas saber sobre DannaShop: políticas, categorías, preguntas frecuentes y más.
          </p>
          {/* Navegación rápida en móvil */}
          <div className="flex flex-wrap gap-2 mt-5 md:hidden">
            {quickSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-bgForms/30 text-danashop-brandSoft border border-danashop-borderColor hover:bg-danashop-brandMain hover:text-white hoverEffect"
              >
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-10">
        <div className="flex gap-8 items-start">

          {/* ── Índice lateral — solo desktop ── */}
          <aside className="hidden md:block w-56 shrink-0 sticky top-24">
            <p className="text-[10px] font-bold uppercase tracking-widest text-danashop-textMuted mb-3">En esta página</p>
            <nav className="flex flex-col gap-1">
              {quickSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors hoverEffect ${
                    activeSection === s.id
                      ? "bg-bgForms/40 text-danashop-brandSoft border-l-2 border-danashop-brandMain pl-2.5"
                      : "text-danashop-textSecondary hover:text-danashop-textPrimary hover:bg-danashop-hover/40"
                  }`}
                >
                  <span className={activeSection === s.id ? "text-danashop-brandSoft" : "text-danashop-textMuted"}>
                    {s.icon}
                  </span>
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ── Contenido principal ── */}
          <div className="flex-1 space-y-12 min-w-0">

            {/* Sobre nosotros */}
            <SectionBlock id="sobre-nosotros" icon={<Info size={17} />} title="Sobre Nosotros">
              <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5 space-y-3 text-danashop-textSecondary text-base leading-relaxed">
                <p>
                  <strong className="text-danashop-textPrimary">DannaShop</strong> es una tienda en línea colombiana fundada con el propósito de acercar tecnología, electrodomésticos y accesorios de calidad a todos los hogares del país, a precios competitivos y con una experiencia de compra simple y segura.
                </p>
                <p>
                  Nos comprometemos a ofrecer productos verificados, atención al cliente cercana y envíos confiables a todo el territorio nacional. Nuestro equipo trabaja todos los días para que cada compra sea una experiencia positiva.
                </p>
                <p>
                  Creemos que la tecnología mejora la vida de las personas, y nuestra misión es que puedas acceder a ella sin complicaciones.
                </p>
              </div>
            </SectionBlock>

            {/* Contáctanos */}
            <SectionBlock id="contactanos" icon={<Phone size={17} />} title="Contáctanos">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "WhatsApp", value: "+57 312 624 86 17", sub: "Lunes a Sábado, 8am – 5pm" },
                  { label: "Correo electrónico", value: "hincapiestefania110@gmail.com", sub: "Respondemos en menos de 24h" },
                  { label: "Instagram", value: "@variedadeslasdannas", sub: "Síguenos para novedades" },
                  { label: "Ciudad", value: "Cali, Valle del Cauca", sub: "Colombia 🇨🇴" },
                ].map((item) => (
                  <div key={item.label} className="bg-danashop-bgColorCard border border-danashop-textSecondary/50 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-danashop-textMuted mb-1">{item.label}</p>
                    <p className="text-base font-bold text-danashop-textPrimary">{item.value}</p>
                    <p className="text-sm text-danashop-textSecondary mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* Términos y condiciones */}
            <SectionBlock id="terminos" icon={<FileText size={17} />} title="Términos y Condiciones">
              <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5 space-y-4 text-danashop-textSecondary text-base leading-relaxed">
                {[
                  ["1. Aceptación", "Al acceder y usar DannaShop, aceptas cumplir con estos términos. Si no estás de acuerdo con alguna parte, te pedimos que no uses nuestra plataforma."],
                  ["2. Uso del sitio", "Este sitio es solo para uso personal y no comercial. No puedes copiar, distribuir ni modificar ningún contenido sin autorización expresa por escrito."],
                  ["3. Precios y disponibilidad", "Nos reservamos el derecho de modificar precios en cualquier momento. Los pedidos confirmados y pagados no serán afectados por cambios posteriores."],
                  ["4. Responsabilidad", "DannaShop no se hace responsable por daños indirectos derivados del uso o la imposibilidad de usar nuestros productos o servicios."],
                  ["5. Modificaciones", "Podemos actualizar estos términos en cualquier momento. Te notificaremos de cambios importantes a través del correo registrado."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <p className="font-bold text-danashop-textPrimary mb-1">{title}</p>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* Política de privacidad */}
            <SectionBlock id="politicas" icon={<Shield size={17} />} title="Política de Privacidad">
              <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5 space-y-4 text-danashop-textSecondary text-base leading-relaxed">
                {[
                  ["Datos que recopilamos", "Recopilamos nombre, correo electrónico, teléfono y dirección de envío con el único fin de procesar tus pedidos y mejorar tu experiencia de compra."],
                  ["Uso de la información", "Tu información nunca será vendida ni compartida con terceros con fines comerciales. Solo la compartimos con aliados logísticos para completar tus envíos."],
                  ["Cookies", "Usamos cookies para mejorar la navegación y personalizar tu experiencia. Puedes desactivarlas desde la configuración de tu navegador."],
                  ["Seguridad", "Implementamos medidas técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración."],
                  ["Tus derechos", "Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Contáctanos a soporte@dannashop.co para ejercerlos."],
                ].map(([title, text]) => (
                  <div key={title}>
                    <p className="font-bold text-danashop-textPrimary mb-1">{title}</p>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* FAQs */}
            <SectionBlock id="faqs" icon={<HelpCircle size={17} />} title="Preguntas Frecuentes">
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-danashop-bgColorCard border border-danashop-textSecondary/50 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer text-base font-bold text-danashop-textPrimary list-none select-none">
                      {faq.q}
                      <ChevronRight size={16} className="text-danashop-brandSoft transition-transform duration-300 group-open:rotate-90 shrink-0 ml-2" />
                    </summary>
                    <p className="px-5 pb-4 text-base text-danashop-textSecondary leading-relaxed border-t border-danashop-textSecondary/20 pt-3">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </SectionBlock>

            {/* Ayuda */}
            <SectionBlock id="ayuda" icon={<LifeBuoy size={17} />} title="Ayuda">
              <div className="bg-danashop-bgColorCard rounded-xl border border-danashop-textSecondary/50 p-5">
                <p className="text-base text-danashop-textSecondary mb-5 leading-relaxed">
                  ¿No encontraste lo que buscabas? Nuestro equipo está listo para ayudarte. Elige el canal que prefieras.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-danashop-brandMain/10 border border-danashop-brandMain/30 text-danashop-brandSoft text-base font-semibold hover:bg-danashop-brandMain hover:text-white hoverEffect"
                  >
                    <Phone size={15} /> Contactar soporte
                  </Link>
                  <a
                    href="#faqs"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-bgForms/30 border border-danashop-borderColor text-danashop-textSecondary text-base font-semibold hover:text-danashop-textPrimary hoverEffect"
                  >
                    <HelpCircle size={15} /> Ver preguntas frecuentes
                  </a>
                </div>
              </div>
            </SectionBlock>

          </div>
        </div>
      </Container>

      {/* Botón volver arriba */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-danashop-brandMain text-white shadow-lg hover:bg-danashop-brandHover hoverEffect z-50"
          aria-label="Volver arriba"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
};

export default page;