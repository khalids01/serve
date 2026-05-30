"use client";

import { motion } from "framer-motion";
import { Server, Cloud } from "lucide-react";
import Link from "next/link";

type ProjectLogoProps = {
  href?: string;
  /** Hide wordmark when sidebar is collapsed to icon rail */
  collapseWithSidebar?: boolean;
};

export function ProjectLogo({
  href = "/",
  collapseWithSidebar = false,
}: ProjectLogoProps) {
  return (
    <Link href={href} className="contents">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={
          collapseWithSidebar
            ? "flex items-center space-x-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:space-x-0"
            : "flex items-center space-x-2"
        }
      >
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative shrink-0"
        >
          <Server className="h-8 w-8 text-primary" />
          <Cloud className="absolute -top-1 -right-1 h-4 w-4 text-blue-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={
            collapseWithSidebar
              ? "min-w-0 group-data-[collapsible=icon]:hidden"
              : undefined
          }
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Serve
          </h1>
        </motion.div>
      </motion.div>
    </Link>
  );
}
