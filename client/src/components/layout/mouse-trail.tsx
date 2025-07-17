import React, { useEffect, useRef, useState } from 'react';

const MouseTrail: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorState, setCursorState] = useState({
    isHoveringBigText: false,
    isHoveringCard: false,
    isHoveringFaintGreenCard: false,
    isHoveringInput: false,
    isHoveringSemihTopak: false,
    isHoveringNavbarItem: false,
    cardRect: { x: 0, y: 0, width: 0, height: 0 },
  });
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const effectTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Efektin kaybolması için timeout

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isBigText = target && target.closest('.hover-effect-target');
      const isCard = target && target.closest('.data-hover-target');
      const isInput = target && target.closest('[data-input-hover="true"]');
      const isSemihTopak = target && target.closest('[data-semih-topak-hover="true"]');
      const isNavbarItem = target && target.closest('[data-navbar-item-hover="true"]');

      let newIsHoveringBigText = false; // Hata düzeltildi
      let newIsHoveringCard = false;
      let newIsHoveringFaintGreenCard = false;
      let newIsHoveringInput = false;
      let newIsHoveringSemihTopak = false;
      let newIsHoveringNavbarItem = false;
      let newCardRect = { x: 0, y: 0, width: 0, height: 0 };

      if (isCard) {
        newIsHoveringCard = true;
        newCardRect = isCard.getBoundingClientRect();
        if (isCard.dataset.faintGreenHover === 'true') {
          newIsHoveringFaintGreenCard = true;
        }
        hoveredElementRef.current = isCard; // Store the hovered element

        // Eğer zaten bir timeout varsa temizle
        if (effectTimeoutRef.current) {
          clearTimeout(effectTimeoutRef.current);
          effectTimeoutRef.current = null;
        }
      } else if (isInput) {
        newIsHoveringInput = true;
        newCardRect = isInput.getBoundingClientRect();
        hoveredElementRef.current = isInput;
        if (effectTimeoutRef.current) {
          clearTimeout(effectTimeoutRef.current);
          effectTimeoutRef.current = null;
        }
      } else if (isSemihTopak) {
        newIsHoveringSemihTopak = true;
        newCardRect = isSemihTopak.getBoundingClientRect();
        hoveredElementRef.current = isSemihTopak;
        if (effectTimeoutRef.current) {
          clearTimeout(effectTimeoutRef.current);
          effectTimeoutRef.current = null;
        }
      } else if (isNavbarItem) {
        newIsHoveringNavbarItem = true;
        newCardRect = isNavbarItem.getBoundingClientRect();
        hoveredElementRef.current = isNavbarItem;
        if (effectTimeoutRef.current) {
          clearTimeout(effectTimeoutRef.current);
          effectTimeoutRef.current = null;
        }
      } else if (isBigText) { // Big text is now handled separately for fixed size
        newIsHoveringBigText = true;
        newCardRect = isBigText.getBoundingClientRect(); // Rect bilgisini al
        hoveredElementRef.current = isBigText;
        if (effectTimeoutRef.current) {
          clearTimeout(effectTimeoutRef.current);
          effectTimeoutRef.current = null;
        }
      } else {
        hoveredElementRef.current = null;
        if (cursorState.isHoveringBigText || cursorState.isHoveringCard || cursorState.isHoveringFaintGreenCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem) {
          effectTimeoutRef.current = setTimeout(() => {
            setCursorState((prev) => ({
              ...prev,
              isHoveringBigText: false,
              isHoveringCard: false,
              isHoveringFaintGreenCard: false,
              isHoveringInput: false,
              isHoveringSemihTopak: false,
              isHoveringNavbarItem: false,
              cardRect: { x: 0, y: 0, width: 0, height: 0 },
            }));
          }, 500); // Yarım saniye sonra kaybolsun
        }
      }

      setCursorState((prev) => ({
        ...prev,
        isHoveringBigText: !!isBigText,
        isHoveringCard: newIsHoveringCard,
        isHoveringFaintGreenCard: newIsHoveringFaintGreenCard,
        isHoveringInput: newIsHoveringInput,
        isHoveringSemihTopak: newIsHoveringSemihTopak,
        isHoveringNavbarItem: newIsHoveringNavbarItem,
        cardRect: newCardRect,
      }));
    };

    const handleScroll = () => {
      if (hoveredElementRef.current) {
        const rect = hoveredElementRef.current.getBoundingClientRect();
        setCursorState((prev) => ({
          ...prev,
          cardRect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll); // Add scroll listener

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll); // Clean up scroll listener
      if (effectTimeoutRef.current) {
        clearTimeout(effectTimeoutRef.current);
      }
    };
  }, [cursorState.isHoveringBigText, cursorState.isHoveringCard, cursorState.isHoveringFaintGreenCard, cursorState.isHoveringInput, cursorState.isHoveringSemihTopak, cursorState.isHoveringNavbarItem]); // Bağımlılıkları güncelledim

  const cursorStyle: React.CSSProperties = {
    left: `${cursorState.isHoveringCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? cursorState.cardRect.x : position.x}px`,
    top: `${cursorState.isHoveringCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? cursorState.cardRect.y : position.y}px`,
    width: `${cursorState.isHoveringCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? cursorState.cardRect.width : (cursorState.isHoveringBigText ? 120 : 24)}px`,
    height: `${cursorState.isHoveringCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? cursorState.cardRect.height : (cursorState.isHoveringBigText ? 120 : 24)}px`,
    borderRadius: cursorState.isHoveringCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? '8px' : '50%',
    transform: cursorState.isHoveringCard || cursorState.isHoveringInput || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? 'translate(0, 0)' : 'translate(-50%, -50%)',
    backgroundColor: cursorState.isHoveringCard 
      ? 'transparent' // Kartın üzerindeyken içi boş olsun
      : (cursorState.isHoveringBigText ? 'rgba(255, 255, 255, 0.9)' : 
         cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? 'rgba(255, 255, 255, 0.9)' : 'transparent'),
    borderColor: cursorState.isHoveringCard ? (cursorState.isHoveringFaintGreenCard ? `rgba(255, 255, 255, 0.3)` : `rgba(255, 255, 255, 0.7)`) : (cursorState.isHoveringBigText ? 'transparent' : 
         cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? 'transparent' : 'rgba(255, 255, 255, 0.7)'),
    boxShadow: cursorState.isHoveringCard 
      ? (cursorState.isHoveringFaintGreenCard ? 'none' : `0 0 30px rgba(255, 255, 255, 0.7), 0 0 60px rgba(255, 255, 255, 0.5)`) 
      : (cursorState.isHoveringBigText ? '0 0 20px rgba(255, 255, 255, 0.5)' : 
         cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? `0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.6)` : '0 0 5px rgba(255, 255, 255, 0.3)'),
    mixBlendMode: cursorState.isHoveringBigText || cursorState.isHoveringSemihTopak || cursorState.isHoveringNavbarItem ? 'difference' : 'normal',
    transition: 'all 0.2s ease-out',
  };

  return (
    <div
      ref={cursorRef}
      className="cursor-follower"
      style={cursorStyle}
    />
  );
};

export default MouseTrail;