import React, { useState, useEffect, useRef } from 'react';

const DOT_COUNT = 15;

const CustomCursor: React.FC = () => {
  const [dots, setDots] = useState(Array(DOT_COUNT).fill({ x: -100, y: -100 })); // Start off-screen
  const [isHovering, setIsHovering] = useState(false);
  const animationFrameId = useRef<number>(0);
  const lastCursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastCursorPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input, [role="button"], [class*="cursor-pointer"]')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (
        target.closest('button, a, input, [role="button"], [class*="cursor-pointer"]') &&
        !relatedTarget?.closest('button, a, input, [role="button"], [class*="cursor-pointer"]')
      ) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mouseout', handleMouseOut);

    const animate = () => {
      setDots(currentDots => {
        const newDots = [...currentDots].map(dot => ({ ...dot })); // Deep copy for immutability
        
        // Head dot moves towards the real cursor
        newDots[0].x += (lastCursorPos.current.x - newDots[0].x) * 0.7;
        newDots[0].y += (lastCursorPos.current.y - newDots[0].y) * 0.7;

        // Subsequent dots follow the previous dot
        for (let i = 1; i < DOT_COUNT; i++) {
          newDots[i].x += (newDots[i - 1].x - newDots[i].x) * 0.7;
          newDots[i].y += (newDots[i - 1].y - newDots[i].y) * 0.7;
        }
        return newDots;
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <>
      {dots.map((dot, index) => {
        const scale = (DOT_COUNT - index) / DOT_COUNT;
        const size = isHovering ? 40 : 25;

        return (
          <div
            key={index}
            className="cursor-dot"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${dot.x}px`,
              top: `${dot.y}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
          />
        );
      })}
    </>
  );
};

export default CustomCursor;
