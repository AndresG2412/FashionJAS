// FooterTop.tsx
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import React from "react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Visítanos",
    subtitle: "Mocoa, Colombia",
    icon: <MapPin className="h-6 w-6 text-fashion-gold" />,
  },
  {
    title: "Contacto",
    subtitle: "+57 320 450 4785",
    icon: <Phone className="h-6 w-6 text-fashion-gold" />,
  },
  {
    title: "Horario de Trabajo",
    subtitle: "Lun - Sab: 8:00 - 5:00 PM",
    icon: <Clock className="h-6 w-6 text-fashion-gold" />,
  },
  {
    title: "Correo",
    subtitle: "Fashionjasoficial@gmail.com",
    icon: <Mail className="h-6 w-6 text-fashion-gold" />,
  },
];

const FooterTop = () => {
  return (
    <div className="grid cursor-default grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex justify-center items-start gap-2 bg-fashion-coal/60 border border-fashion-cream/10 shadow-lg rounded-lg hover:bg-fashion-coal p-2 md:p-4 hoverEffect min-w-0"
        >
          <div className="flex flex-col min-w-0 hoverEffect">
            <div className="flex gap-2 justify-center items-center">
              <div>{item?.icon}</div>
              <h3 className="font-semibold text-fashion-cream tracking-wide">
                {item?.title}
              </h3>
            </div>
            <p className="text-fashion-mist text-xs text-center md:text-sm mt-1 tracking-wide wrap-break-word leading-relaxed">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
