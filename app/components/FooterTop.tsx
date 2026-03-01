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
    subtitle: "Cali, Colombia",
    icon: <MapPin className="h-6 w-6 text-shop-darkColor group-hover:text-primary transition-colors shrink-0" />,
  },
  {
    title: "Contacto",
    subtitle: "+57 315 787 0130",
    icon: <Phone className="h-6 w-6 text-shop-darkColor group-hover:text-primary transition-colors shrink-0" />,
  },
  {
    title: "Horario de Trabajo",
    subtitle: "Lun - Sab: 8:00 - 5:00 PM",
    icon: <Clock className="h-6 w-6 text-shop-darkColor group-hover:text-primary transition-colors shrink-0" />,
  },
  {
    title: "Correo",
    subtitle: "Cgaviria930@gmail.com",
    icon: <Mail className="h-6 w-6 text-shop-darkColor group-hover:text-primary transition-colors shrink-0" />,
  },
];

const FooterTop = () => {
  return (
    <div className="grid cursor-default grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 border-b">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2 group hover:bg-gray-100 p-2 md:p-4 transition-colors hoverEffect min-w-0"
        >
          {/* shrink-0 es vital para que el icono no se aplaste cuando el texto salte de línea */}
          <div className="shrink-0 mt-1">
              {item?.icon}
          </div>
          
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-shop-darkText group-hover:text-shop-darkColor hoverEffect">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mt-1 group-hover:text-shop-darkText hoverEffect wrap-break-word leading-relaxed">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;