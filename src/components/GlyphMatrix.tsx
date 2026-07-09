import React, { useEffect, useRef } from 'react';

interface GlyphMatrixProps {
  glyphs?: string;
  cellSize?: number;
  mutationRate?: number;
  interval?: number;
  fadeBottom?: number;
  color?: string;
}

export default function GlyphMatrix({
  glyphs = '01·•+*/\\<>=',
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  fadeBottom = 0.6,
  color = '#000000',
}: GlyphMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    const displayWidth = canvas.width / devicePixelRatio;
    const displayHeight = canvas.height / devicePixelRatio;

    const cols = Math.ceil(displayWidth / cellSize);
    const rows = Math.ceil(displayHeight / cellSize);
    let matrix = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () =>
        glyphs[Math.floor(Math.random() * glyphs.length)]
      )
    );

    let frameCount = 0;

    const animate = () => {
      frameCount++;

      // Update matrix with mutations
      matrix = matrix.map((row, y) =>
        row.map((char, x) => {
          if (Math.random() < mutationRate) {
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          }
          return char;
        })
      );

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.fillStyle = color;
      ctx.font = `${cellSize}px 'Courier New', monospace`;
      ctx.textBaseline = 'top';

      // Draw matrix with fade effect
      matrix.forEach((row, y) => {
        row.forEach((char, x) => {
          const yPos = y * cellSize;
          const fadeStart = displayHeight * (1 - fadeBottom);
          const distanceFromFade = yPos - fadeStart;

          if (distanceFromFade > 0) {
            const fadeAmount = 1 - Math.min(distanceFromFade / (displayHeight * fadeBottom), 1);
            ctx.globalAlpha = fadeAmount;
          } else {
            ctx.globalAlpha = 1;
          }

          ctx.fillText(char, x * cellSize, yPos);
        });
      });

      ctx.globalAlpha = 1;

      if (frameCount < 500) {
        // Animate for a limited time
        setTimeout(animate, interval);
      }
    };

    animate();

    return () => {
      frameCount = 500; // Stop animation on unmount
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
