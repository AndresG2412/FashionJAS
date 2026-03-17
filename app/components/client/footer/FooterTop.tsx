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
    title: "Visitanos",
    subtitle: "Mocoa, Colombia",
    icon: <MapPin className="h-6 w-6 text-eshop-accent" />,
  },
  {
    title: "Contacto",
    subtitle: "+57 320 450 4785",
    icon: <Phone className="h-6 w-6 text-eshop-accent" />,
  },
  {
    title: "Horario de Trabajo",
    subtitle: "Lun - Sab: 8:00 - 5:00 PM",
    icon: <Clock className="h-6 w-6 text-eshop-accent" />,
  },
  {
    title: "Correo",
    subtitle: "Fashionjasoficial@gmail.com",
    icon: <Mail className="h-6 w-6 text-eshop-accent" />,
  },
];

const FooterTop = () => {
  return (
    <div className="grid cursor-default grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex justify-center items-start gap-2 bg-eshop-inCart shadow-lg rounded-lg group hover:bg-eshop-formsBackground p-2 md:p-4 hoverEffect min-w-0"
        >
          <div className="flex flex-col min-w-0 group-hover:scale-105 hoverEffect">
            <div className="flex gap-2 justify-center items-center">
              <div>{item?.icon}</div>
              <h3 className="font-semibold text-eshop-textPrimary tracking-wide">
                {item?.title}
              </h3>
            </div>
            <p className="text-eshop-textSecondary text-xs text-center md:text-sm mt-1 tracking-wide wrap-break-word leading-relaxed">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;