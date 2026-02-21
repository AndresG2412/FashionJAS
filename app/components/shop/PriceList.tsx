import React from "react";
import Title from "../Title";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const priceArray = [
  { title: "Menos de $500.000", value: "0-500000" },
  { title: "$500.000 - $1.000.000", value: "500000-1000000" },
  { title: "$1.000.000 - $2.000.000", value: "1000000-2000000" },
  { title: "$2.000.000 - $3.000.000", value: "2000000-3000000" },
  { title: "Más de $3.000.000", value: "3000000-100000000" }, // 100 millones de tope
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}

const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5 rounded-lg shadow-sm">
      <Title className="text-base font-black">Precio</Title>
      <RadioGroup className="mt-2 space-y-1" value={selectedPrice || ""}>
        {priceArray?.map((price, index) => (
          <div
            key={index}
            onClick={() => setSelectedPrice(price?.value)}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price.value}
              className={`cursor-pointer ${
                selectedPrice === price?.value
                  ? "font-semibold text-shop_dark_green"
                  : "font-normal"
              }`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {selectedPrice && (
        <button
          onClick={() => setSelectedPrice(null)}
          className="text-sm font-medium mt-2 underline underline-offset-2 decoration-1 hover:text-shop_dark_green hoverEffect"
        >
          Limpiar selección
        </button>
      )}
    </div>
  );
};

export default PriceList;