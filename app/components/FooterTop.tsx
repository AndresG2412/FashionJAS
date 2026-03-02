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
    icon: <MapPin className="h-6 w-6 text-danashop-textPrimary group-hover:text-primary transition-colors shrink-0" />,
  },
  {
    title: "Contacto",
    subtitle: "+57 315 787 0130",
    icon: <Phone className="h-6 w-6 text-danashop-textPrimary group-hover:text-primary transition-colors shrink-0" />,
  },
  {
    title: "Horario de Trabajo",
    subtitle: "Lun - Sab: 8:00 - 5:00 PM",
    icon: <Clock className="h-6 w-6 text-danashop-textPrimary group-hover:text-primary transition-colors shrink-0" />,
  },
  {
    title: "Correo",
    subtitle: "Cgaviria930@gmail.com",
    icon: <Mail className="h-6 w-6 text-danashop-textPrimary group-hover:text-primary transition-colors shrink-0" />,
  },
];

const FooterTop = () => {
  return (
    <div className="grid cursor-default grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex justify-center items-start gap-2 border-t border-danashop-brandSoft shadow-lg/50 md:shadow-lg rounded-lg shadow-purple-400 group hover:bg-gray-100 p-2 md:p-4 transition-colors hoverEffect min-w-0"
        >
          
          <div className="flex flex-col min-w-0">
            
          <div className="flex gap-2 justify-center items-center">
            {/* shrink-0 es vital para que el icono no se aplaste cuando el texto salte de línea */}
          <div className="shrink-0 mt-1">
              {item?.icon}
          </div>
            <h3 className="font-semibold text-danashop-textPrimary tracking-wide group-hover:text-danashop-textDark hoverEffect">
              {item?.title}
            </h3>
          </div>
            <p className="text-gray-300 text-xs text-center md:text-sm mt-1 group-hover:text-danashop-textDark tracking-wide hoverEffect wrap-break-word leading-relaxed">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;