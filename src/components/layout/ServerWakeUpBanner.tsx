'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLightningBolt, HiCheckCircle, HiX, HiRefresh } from 'react-icons/hi';

const HEALTH_URL =
  process.env.NEXT_PUBLIC_HEALTH_URL ||
  (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')
    ? `${process.env.NEXT_PUBLIC_API_URL}/health`
    : 'https://nutri-ai-server.onrender.com/api/health');

const COUNTDOWN_SECONDS = 30;
const SLEEP_DETECTION_DELAY_MS = 2000; // If server doesn't respond in 2s, consider it sleeping

export default function ServerWakeUpBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isDismissed, setIsDismissed] = useState(false);
  const [hasError, setHasError] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isCheckingRef = useRef(false);

  const checkHealth = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const res = await fetch(HEALTH_URL, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setIsAwake(true);
        setHasError(false);
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        // Keep success state for 2.5 seconds then smoothly hide
        setTimeout(() => {
          setShowBanner(false);
        }, 2500);
      }
    } catch {
      // In flight or still waking up
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let sleepCheckTimer: NodeJS.Timeout | null = null;
    let isMounted = true;

    // Fast check: start immediately
    checkHealth();

    // If not awake within 2s, assume cold start / sleeping on Render
    sleepCheckTimer = setTimeout(() => {
      if (isMounted && !isAwake) {
        setShowBanner(true);
        setCountdown(COUNTDOWN_SECONDS);

        // Keep pinging every 4 seconds until server responds
        pollIntervalRef.current = setInterval(() => {
          if (!isAwake) {
            checkHealth();
          }
        }, 4000);
      }
    }, SLEEP_DETECTION_DELAY_MS);

    return () => {
      isMounted = false;
      if (sleepCheckTimer) clearTimeout(sleepCheckTimer);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkHealth, isAwake]);

  // 1-second countdown interval
  useEffect(() => {
    if (!showBanner || isAwake) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showBanner, isAwake]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key="server-wake-up-banner"
          initial={{ height: 0, opacity: 0, y: -8 }}
          animate={{ height: 'auto', opacity: 1, y: 0 }}
          exit={{ height: 0, opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-40 w-full overflow-hidden"
        >
          <div
            className={`relative flex items-center justify-between gap-3 px-4 py-2 sm:px-6 backdrop-blur-md transition-colors duration-500 ${
              isAwake
                ? 'border-b border-emerald-500/30 bg-emerald-500/15 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'border-b border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-amber-500/15 text-[#163330] dark:border-amber-500/30 dark:from-amber-950/50 dark:via-[#007F78]/25 dark:to-amber-950/50 dark:text-amber-100'
            }`}
          >
            {/* Left side: Icon + Live status countdown message */}
            <div className="flex items-center gap-2.5">
              {isAwake ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs dark:bg-emerald-600">
                  <HiCheckCircle className="h-4 w-4" />
                </span>
              ) : (
                <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300">
                  <HiLightningBolt className="h-3.5 w-3.5 animate-pulse" />
                  <span className="absolute inset-0 rounded-full border border-amber-500/40 animate-ping opacity-50" />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm font-semibold">
                {isAwake ? (
                  <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                    <span>✨ Server is awake & ready!</span>
                  </span>
                ) : (
                  <>
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      Waking Server up in
                    </span>
                    <span className="inline-flex items-center justify-center rounded-md bg-amber-500/20 px-2 py-0.5 font-mono font-bold text-amber-800 dark:bg-amber-400/20 dark:text-amber-100">
                      {countdown > 0 ? `(${countdown} Sec)` : 'Almost ready...'}
                    </span>
                    <span className="hidden md:inline text-xs font-normal text-amber-800/80 dark:text-amber-200/70">
                      (Render free tier sleeps after 15m of inactivity)
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right side: Retry action / Dismiss X */}
            <div className="flex items-center gap-2">
              {!isAwake && countdown === 0 && (
                <button
                  type="button"
                  onClick={() => checkHealth()}
                  title="Check server again"
                  className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-500/20 dark:text-amber-200 cursor-pointer"
                >
                  <HiRefresh className="h-3 w-3 animate-spin" />
                  <span>Checking...</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss banner"
                title="Dismiss"
                className="flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200 cursor-pointer"
              >
                <HiX className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bottom Progress Bar indicating countdown */}
            {!isAwake && (
              <div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-500 transition-all duration-1000 ease-linear"
                style={{
                  width: `${Math.min(100, Math.max(0, ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100))}%`,
                }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
