"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa6';
import { HiMail, HiX, HiExternalLink } from 'react-icons/hi';

const SOCIAL_LINKS = [
  {
    href: 'https://programmer-zunaid.vercel.app/',
    label: 'Portfolio',
    icon: FaGlobe,
    hoverClass: 'hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10',
  },
  {
    href: 'https://github.com/ZunaidChowdhury',
    label: 'GitHub',
    icon: FaGithub,
    hoverClass: 'hover:text-white hover:border-gray-500 hover:bg-white/10',
  },
  {
    href: 'https://www.linkedin.com/in/zunaid-chowdhury-784735237/',
    label: 'LinkedIn',
    icon: FaLinkedin,
    hoverClass: 'hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10',
  },
  {
    href: 'mailto:programmer.zunaid@gmail.com',
    label: 'Email',
    icon: HiMail,
    hoverClass: 'hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10',
  },
];

const DeveloperBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in smoothly from top after 1 second of loading the site
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="developer-bar"
          initial={{ height: 0, opacity: 0, y: -16 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -16 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full overflow-hidden bg-black text-white border-b border-gray-800 relative"
        >
          {/* Subtle high-tech ambient gradient accent hairline */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 via-purple-500/30 to-transparent" />

          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 md:px-8">
            {/* Left Side: Developer Info (Preserved exact style) */}
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-medium">
                Developed by
              </span>

              <Link
                href="https://programmer-zunaid.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 !no-underline"
              >
                <span className="font-bold text-sm sm:text-base bg-linear-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent transition-opacity group-hover:opacity-90">
                  Programmer Zunaid
                </span>

                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700 bg-gray-900 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:border-purple-500/60">
                  <Image
                    src="/assets/programmer-zunaid.png"
                    alt="Programmer Zunaid"
                    fill
                    sizes="32px"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              </Link>
            </div>

            {/* Right Side: Modern Social Platform Icons, Links & 'X' Close Button */}
            <div className="flex items-center space-x-2 sm:space-x-3 text-base text-gray-400">
              {/* Social Icons */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {SOCIAL_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.label}
                      aria-label={item.label}
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-800 bg-gray-900/80 text-gray-400 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xs ${item.hoverClass}`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                  );
                })}
              </div>

              {/* Quick Portfolio link */}
              <Link
                href="https://programmer-zunaid.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-gray-800 bg-gray-900/90 px-3 py-1 text-xs font-semibold text-gray-300 transition-all duration-200 hover:border-gray-700 hover:text-white hover:bg-gray-800 hover:scale-105 active:scale-95 !no-underline"
              >
                <span>Portfolio</span>
                <HiExternalLink className="h-3 w-3 text-gray-400" />
              </Link>

              {/* Subtle divider */}
              <div className="h-4 w-[1px] bg-gray-800" />

              {/* Close 'X' Button */}
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                aria-label="Close developer bar"
                title="Close"
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-gray-800 bg-gray-900/60 text-gray-400 transition-all duration-200 hover:border-gray-700 hover:bg-gray-800 hover:text-white active:scale-95 cursor-pointer"
              >
                <HiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeveloperBar;