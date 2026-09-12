'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheckCircle, HiX, HiRefresh } from 'react-icons/hi';

const HEALTH_URL =
  process.env.NEXT_PUBLIC_HEALTH_URL ||
  (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost')
    ? `${process.env.NEXT_PUBLIC_API_URL}/health`
    : 'https://nutri-ai-server.onrender.com/api/health');

const COUNTDOWN_SECONDS = 20;
const SLEEP_DETECTION_DELAY_MS = 1000; // If server doesn't respond in 1s, consider it sleeping

export default function ServerWakeUpBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isDismissed, setIsDismissed] = useState(false);

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
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        // Keep success state for 2.5 seconds then smoothly hide
        setTimeout(() => {
          setShowBanner(false);
        }, 2500);
      }
    } catch {
      // Still in flight or waking up
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

        // Keep pinging every 2 seconds until server responds
        pollIntervalRef.current = setInterval(() => {
          if (!isAwake) {
            checkHealth();
          }
        }, 2000);
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
            className={`w-full border-b transition-colors duration-500 relative ${
              isAwake
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-emerald-950/80 dark:border-emerald-800/60 dark:text-emerald-200'
                : 'bg-amber-50/95 border-amber-200 text-amber-900 dark:bg-amber-950/70 dark:border-amber-800/50 dark:text-amber-200'
            }`}
          >
            {/* Constrained container to 1280px */}
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-2 relative flex items-center justify-center min-h-[40px]">
              {/* Centered Message */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-center pr-8 pl-2 sm:pr-10">
                {isAwake ? (
                  <>
                    <HiCheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                      Server is awake & ready!
                    </span>
                  </>
                ) : (
                  <>
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                    <span>
                      Waking Server up in{' '}
                      <span className="font-bold font-mono bg-amber-200/70 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 px-1.5 py-0.5 rounded text-xs sm:text-sm">
                        {countdown > 0 ? `(${countdown} Sec)` : 'Almost ready...'}
                      </span>
                    </span>
                    <span className="hidden md:inline text-xs text-amber-700/80 dark:text-amber-300/70 font-normal">
                      • Render backend sleeps after 15m of inactivity
                    </span>
                  </>
                )}
              </div>

              {/* Right Side: Retry / Checking button & 'X' Close button */}
              <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center gap-1.5">
                {!isAwake && countdown === 0 && (
                  <button
                    type="button"
                    onClick={() => checkHealth()}
                    title="Check server again"
                    className="hidden sm:flex items-center gap-1 rounded-md border border-amber-300/80 bg-amber-100/60 px-2 py-0.5 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:border-amber-700/60 dark:bg-amber-900/40 dark:text-amber-200 cursor-pointer"
                  >
                    <HiRefresh className="h-3 w-3 animate-spin" />
                    <span>Checking...</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  aria-label="Close waking server banner"
                  title="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:text-gray-800 hover:bg-black/5 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <HiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Bottom Progress Bar */}
            {!isAwake && (
              <div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-400 to-[#007F78] transition-all duration-1000 ease-linear"
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
