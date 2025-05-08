// src/components/AnimatedNavLink.tsx
"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react';

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedNavLink({
  href,
  children,
  className = '',
}: AnimatedNavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [lineLength] = useState(60);

  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-block text-sm font-medium text-foreground hover:text-primary transition duration-200',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Único hijo de <Link>: un span que engloba texto y SVG */}
      <span className="relative inline-block">
        {children}
        <svg
          aria-hidden="true"
          className="absolute bottom-[-2px] left-0 w-full h-[2px] overflow-visible"
          viewBox={`0 0 ${lineLength} 2`}
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="1"
            x2={lineLength}
            y2="1"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={lineLength}
            strokeDashoffset={isHovered ? 0 : lineLength}
            className="transition-stroke-dashoffset duration-250 ease-[cubic-bezier(.08,.69,.1,1)]"
          />
        </svg>
      </span>
    </Link>
  );
}
