"use client";

import React from 'react';

interface LiquidGlassCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isButton?: boolean;
}

export default function LiquidGlassCard({ 
  title = "Get Started", 
  subtitle = "Experience Premium Refraction", 
  children, 
  className = "", 
  onClick,
  isButton = false
}: LiquidGlassCardProps) {
  const isClickable = typeof onClick === "function" || isButton;
  const mainClass = isClickable ? "liquid-glass-btn" : "liquid-glass-card";

  return (
    <div className={`liquid-glass-wrapper ${className}`}>
      
      {/* Hidden SVG Filter (Bends the background light) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="apple-liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage 
            x="0" y="0" width="420" height="280" 
            href="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22420%22%20height%3D%22280%22%20viewBox%3D%220%200%20420%20280%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22Y%22%20x1%3D%220%22%20x2%3D%220%22%20y1%3D%225%25%22%20y2%3D%2295%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230F0%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22X%22%20x1%3D%224%25%22%20x2%3D%2296%25%22%20y1%3D%220%22%20y2%3D%220%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F00%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22%23808080%22%2F%3E%3Cg%20filter%3D%22blur(2px)%22%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22%23000080%22%2F%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22url(%23Y)%22%20style%3D%22mix-blend-mode%3Ascreen%22%2F%3E%3Crect%20width%3D%22420%22%20height%3D%22280%22%20fill%3D%22url(%23X)%22%20style%3D%22mix-blend-mode%3Ascreen%22%2F%3E%3Crect%20x%3D%2226%22%20y%3D%2226%22%20width%3D%22368%22%20height%3D%22228%22%20rx%3D%2266%22%20ry%3D%2266%22%20fill%3D%22%23808080%22%20filter%3D%22blur(26px)%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E" 
            result="displacementMap" 
          />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="76" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" result="displacedR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="74" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" result="displacedG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="72" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" result="displacedB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          <feBlend in="displacedR" in2="displacedG" mode="screen" result="rg" />
          <feBlend in="rg" in2="displacedB" mode="screen" />
        </filter>
      </svg>

      {/* Renders as div to support flexible layout. Uses liquid-glass-card for static cards, liquid-glass-btn for clickable buttons */}
      <div 
        onClick={onClick}
        className={`${mainClass} !w-full !h-full flex flex-col`}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
      >
        <div className="glass-specular-shine"></div>
        
        {children ? children : (
          <div className="glass-btn-content w-full h-full flex flex-col items-center justify-center p-4">
            <span className="glass-btn-title">{title}</span>
            <span className="glass-btn-subtitle">{subtitle}</span>
          </div>
        )}
      </div>

    </div>
  );
}
