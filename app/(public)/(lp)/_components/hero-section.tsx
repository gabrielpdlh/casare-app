"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-10 md:py-20">
        <h1 className="text-primary relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-5xl">
          {"Organize seu casamento sem planilhas, estresse ou bagunça."
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-2xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Gerencie convidados, despesas e tudo o que importa em um único lugar,
          de forma simples e intuitiva.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button className="w-60 transform rounded-lg px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 ">
            Saiba mais
          </Button>
          <Button
            variant="outline"
            className="border-primary w-60 transform rounded-lg px-6 py-2 font-medium text-primary transition-all duration-300 hover:-translate-y-0.5"
          >
            Teste Grátis
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
