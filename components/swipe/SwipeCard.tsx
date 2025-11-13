"use client";

import { useState, useRef, useEffect } from "react";
import { BillItem } from "@/lib/types/session";
import { ItemCard } from "./ItemCard";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  item: BillItem;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  totalItems: number;
  currentIndex: number;
}

export function SwipeCard({
  item,
  onSwipeLeft,
  onSwipeRight,
  totalItems,
  currentIndex,
}: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const SWIPE_THRESHOLD = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - startPos.current.x;
    const deltaY = currentY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });

    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });

    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? "right" : "left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startPos.current.x;
        const deltaY = e.clientY - startPos.current.y;
        setDragOffset({ x: deltaX, y: deltaY });

        if (Math.abs(deltaX) > 50) {
          setSwipeDirection(deltaX > 0 ? "right" : "left");
        } else {
          setSwipeDirection(null);
        }
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);

        if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
          if (dragOffset.x > 0) {
            onSwipeRight();
          } else {
            onSwipeLeft();
          }
        }

        setDragOffset({ x: 0, y: 0 });
        setSwipeDirection(null);
      };

      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove);
        window.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragOffset.x, onSwipeLeft, onSwipeRight]);

  const rotation = dragOffset.x * 0.1;
  const opacity = 1 - Math.abs(dragOffset.x) / 300;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Swipe feedback overlays */}
      {swipeDirection && (
        <div
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center text-6xl font-bold transition-opacity pointer-events-none",
            swipeDirection === "left" && "text-red-500",
            swipeDirection === "right" && "text-green-500"
          )}
        >
          {swipeDirection === "left" ? "✗" : "✓"}
        </div>
      )}

      <div
        ref={cardRef}
        className={cn(
          "touch-none select-none transition-transform",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
          opacity,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <ItemCard
          item={item}
          totalItems={totalItems}
          currentIndex={currentIndex}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 text-sm text-muted-foreground pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl">←</span>
          <span>NO</span>
        </div>
        <div className="flex items-center gap-2">
          <span>SÍ</span>
          <span className="text-green-500 text-2xl">→</span>
        </div>
      </div>
    </div>
  );
}
