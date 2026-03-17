"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

const NoProductAvailable = ({
  selectedTab,
  className,
}: {
  selectedTab?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-eshop-bgCard rounded-lg w-full mt-10",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-eshop-textPrimary">
          Producto no Disponible
        </h2>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="flex items-center space-x-2 text-eshop-goldDeep text-base"
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Pronto los tendremos de vuelta!</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-sm text-eshop-textSecondary px-10 md:px-0"
      >
        Lo sentimos, pero no hay productos que coincidan con{" "}
        <span className="text-base font-semibold text-eshop-textPrimary">
          {selectedTab}
        </span>{" "}
        en este momento.<br />puedes explorar otras categorías para encontrar productos similares.
      </motion.p>
    </div>
  );
};

export default NoProductAvailable;
