"use client";
import React, { useState } from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const priceArray = [
  { title: "Menos de $500.000", value: "0-500000" },
  { title: "$500.000 - $1.000.000", value: "500000-1000000" },
  { title: "$1.000.000 - $2.500.000", value: "1000000-2500000" },
  { title: "$2.500.000 - $5.000.000", value: "2500000-5000000" },
  { title: "Más de $5.000.000", value: "5000000-100000000" },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: string) => {
    setSelectedPrice(val);
    setIsOpen(false); // Cierre automático
  };

  return (
    <div className="w-full bg-eshop-bgCard rounded-lg shadow-sm border-eshop-goldLight border-2 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2.5 hover:bg-eshop-formsBackground hoverEffect"
      >
        <Title className="text-base font-black text-eshop-accent/90 tracking-wider mb-0 font-serif">Precio</Title>
        <ChevronDown 
          className={`w-5 h-5 hoverEffect text-eshop-textPrimary ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-5 pb-5 pt-0">
              <RadioGroup className="mt-2 space-y-1" value={selectedPrice || ""}>
                {priceArray?.map((price, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(price?.value)}
                    className="flex items-center space-x-2 py-1.5 hover:cursor-pointer group"
                  >
                    <RadioGroupItem
                      value={price?.value}
                      id={`price-${index}`}
                      className="rounded-sm color-white border border-eshop-textSecondary/40 text-eshop-textPrimary peer-data-[state=checked]:bg-eshop-accent text-sm hoverEffect group-hover:bg-eshop-accent/50"
                    />
                    <Label
                      htmlFor={`price-${index}`}
                      className={`cursor-pointer flex-1 ${
                        selectedPrice === price?.value
                          ? "font-semibold text-eshop-textPrimary"
                          : "font-normal text-eshop-textSecondary"
                      }`}
                    >
                      {price?.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              {selectedPrice && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrice(null);
                  }}
                  className="font-serif text-sm font-medium mt-4 underline underline-offset-2 decoration-1 cursor-pointer hoverEffect text-red-600 hover:text-red-400 text-left block"
                >
                  Limpiar selección
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriceList;