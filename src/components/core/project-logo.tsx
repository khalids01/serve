"use client";

import { motion } from "framer-motion";
import { Server, Cloud } from "lucide-react";
import Link from "next/link";

export function ProjectLogo() {
  return (
    <Link href="/" className="contents">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2"
      >
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <Server className="h-8 w-8 text-primary" />
          <Cloud className="absolute -top-1 -right-1 h-4 w-4 text-blue-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Serve
          </h1>
        </motion.div>
      </motion.div>
    </Link>
  );
}
