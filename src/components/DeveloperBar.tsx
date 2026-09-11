"use client"; // Required for hooks in Next.js 15

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const DeveloperBar = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`
        grid transition-all duration-700 ease-in-out
        ${isVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
      `}
        >
            <nav className="overflow-hidden bg-black text-white border-b border-gray-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 md:px-8">

                    {/* Left Side: Developer Info */}
                    <div className="flex items-center space-x-2">
                        <span className="text-base font-medium">
                            Developed by
                        </span>

                        <Link
                            href="https://programmer-zunaid.vercel.app/"
                            target="_blank" rel="noopener noreferrer"
                            className='flex items-center space-x-2 '>

                            <span className="font-bold bg-linear-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent">Programmer Zunaid</span>

                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700 bg-gray-900">
                                <Image
                                    src="/assets/programmer-zunaid.png"
                                    alt="Programmer Zunaid"
                                    fill
                                    className="object-cover"
                                    priority={false}
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right Side: Developer Links */}
                    <div className="flex items-center space-x-6 text-base text-gray-400">
                        <Link
                            href="https://programmer-zunaid.vercel.app/"
                            target="_blank" rel="noopener noreferrer"
                            className="hover:text-white transition-colors duration-200">Portfolio</Link>
                        <Link
                            href="https://www.linkedin.com/in/zunaid-chowdhury-784735237/"
                            target="_blank" rel="noopener noreferrer"
                            className="hover:text-white transition-colors duration-200">LinkedIn</Link>
                        {/* <Link href="#" className="hover:text-white transition-colors duration-200">LeetCode</Link> */}
                    </div>

                </div>
            </nav>
        </div>
    );
}

export default DeveloperBar