"use client";

import { cn } from '@/lib/utils'; // Import cn for combining classes
import Link from 'next/link';
import React, { useRef, useState } from 'react';

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedNavLink({ href, children, className = '' }: AnimatedNavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [lineLength] = useState(60); // Start with default length

  // Removed useEffect for simplicity, using fixed lineLength.
  // Dynamic calculation can be added back if needed.

  return (
    <Link 
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative inline-block text-sm font-medium text-foreground hover:text-primary focus:outline-none focus:text-primary transition-colors duration-200 group',
        className
      )}
    >
      {children}
      <svg 
        ref={svgRef}
        aria-hidden="true"
        className="absolute bottom-[-2px] left-0 w-full h-[2px] overflow-visible"
        width="100%"
        height="2"
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
          className={`transition-stroke-dashoffset duration-250 ease-[cubic-bezier(.08,.69,.1,1)]`}
        />
      </svg>
    </Link>
  );
} 