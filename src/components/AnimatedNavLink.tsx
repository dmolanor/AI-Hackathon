"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedNavLink({ href, children, className = '' }: AnimatedNavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [lineLength, setLineLength] = useState(0);

  useEffect(() => {
    if (svgRef.current) {
      // A simple approximation for line length. For perfect results, use getComputedTextLength on a hidden text element or a fixed width.
      // This assumes the SVG line should roughly match the width of the link content.
      // For a more robust solution, you might pass a width or calculate based on text.
      // Here, we'll use a common approach: make the line a bit wider than typical text.
      setLineLength(60); // Default/estimated length, adjust as needed or calculate dynamically
    }
  }, []);

  return (
    <Link 
      href={href}
      className={`relative inline-block text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <svg 
        ref={svgRef}
        className="absolute bottom-[-2px] left-0 w-full h-[2px] overflow-visible group-hover:animate-draw-line"
        width="100%" // Use percentage for responsiveness with link width
        height="2"
        viewBox={`0 0 ${lineLength || 60} 2`} // viewBox width should match lineLength
        preserveAspectRatio="none"
      >
        <line 
          x1="0" 
          y1="1" 
          x2={lineLength || 60} // line end x should match lineLength
          y2="1" 
          stroke="currentColor" // Inherits text-primary on hover due to group-hover
          strokeWidth="2" 
          strokeDasharray={lineLength || 60} 
          strokeDashoffset={isHovered ? 0 : (lineLength || 60)}
          className={`${isHovered ? '' : 'transition-all duration-250 ease-[cubic-bezier(.08,.69,.1,1)]'}`}
        />
      </svg>
    </Link>
  );
} 