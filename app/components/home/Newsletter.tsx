"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Send, CheckCircle2 } from "lucide-react";
import Reveal from "./Reveal";

const newsletterBg = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    setError("");
    setSuccess(true);
    setEmail("");
  };

  return (
    <section className="py-16 lg:py-24 text-fashion-cream relative overflow-hidden">
      {/* fondo con imagen y overlay */}
      <div className="absolute inset-0">
        <Image
          src={newsletterBg}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-fashion-ink/95 via-fashion-ink/85 to-fashion-wine/80" />
      </div>

      <Reveal className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full border border-fashion-gold/40 bg-fashion-gold/10 text-fashion-goldsoft text-xs font-semibold tracking-[0.25em] uppercase">
          Newsletter
        </span>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl font-bold leading-tight">
          Sé la primera en conocer <span className="italic text-gradient-gold">lo nuevo</span>
        </h2>
        <p className="mt-4 text-fashion-mist text-lg">
          Recibe novedades, lanzamientos y ofertas exclusivas directamente en tu correo.
        </p>

        {success ? (
          <div
            role="status"
            className="mt-10 mx-auto max-w-md rounded-2xl bg-fashion-gold/10 border border-fashion-gold/40 px-6 py-6 flex items-center gap-4"
          >
            <CheckCircle2 className="w-8 h-8 text-fashion-gold shrink-0" />
            <p className="text-left font-semibold">
              ¡Gracias por suscribirte! Te avisaremos de todo lo nuevo de FashionJAS.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-10 mx-auto max-w-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Correo electrónico
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="tucorreo@ejemplo.com"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-error" : undefined}
                className="flex-1 px-5 py-4 rounded-full bg-fashion-cream/10 border border-fashion-cream/25 text-fashion-cream placeholder:text-fashion-mist focus:outline-none focus:border-fashion-gold focus:ring-2 focus:ring-fashion-gold/30 transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-fashion-fuchsia hover:bg-fashion-rose text-white font-bold px-7 py-4 rounded-full transition-all shadow-lg shadow-fashion-fuchsia/30 hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5" />
                Quiero recibir novedades
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-3 text-left text-red-300 text-sm font-medium">
                {error}
              </p>
            )}
          </form>
        )}
      </Reveal>
    </section>
  );
};

export default Newsletter;
