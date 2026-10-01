"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { announcementMessages } from "../../constants/homeData";

const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % announcementMessages.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-fashion-ink text-fashion-cream/90 text-center relative overflow-hidden">
      <div className="h-10 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase"
          >
            {announcementMessages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      {/* línea dorada inferior */}
      <div className="h-px bg-gradient-to-r from-transparent via-fashion-gold/70 to-transparent" />
    </div>
  );
};

export default AnnouncementBar;
