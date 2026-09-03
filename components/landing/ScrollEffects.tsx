'use client';

import React, { useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

export function ScrollEffects() {
  const scrollTopBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    const updateScrollVisuals = () => {
      const totalScroll = window.scrollY || document.documentElement.scrollTop || 0;

      if (scrollTopBtnRef.current) {
        if (totalScroll > 380) {
          scrollTopBtnRef.current.style.opacity = '1';
          scrollTopBtnRef.current.style.pointerEvents = 'auto';
          scrollTopBtnRef.current.style.transform = 'translateY(0)';
        } else {
          scrollTopBtnRef.current.style.opacity = '0';
          scrollTopBtnRef.current.style.pointerEvents = 'none';
          scrollTopBtnRef.current.style.transform = 'translateY(12px)';
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollVisuals);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollVisuals();

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    });

    const triggerVisible = () => {
      const elements = document.querySelectorAll('.scroll-animate:not(.is-visible)');
      elements.forEach(el => {
        observer.observe(el);
      });
    };

    triggerVisible();

    const safetyTimer = setTimeout(() => {
      document.querySelectorAll('.scroll-animate').forEach(el => el.classList.add('is-visible'));
    }, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearTimeout(safetyTimer);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      ref={scrollTopBtnRef}
      onClick={scrollToTop}
      className="scroll-to-top-btn"
      aria-label="Scroll back to top"
      style={{
        position: 'fixed',
        bottom: '84px',
        right: '20px',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        border: '1.5px solid rgba(0, 160, 223, 0.4)',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 9990,
        opacity: 0,
        pointerEvents: 'none',
        transform: 'translateY(12px)',
        transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
        willChange: 'opacity, transform'
      }}
    >
      <ChevronUp size={20} color="#00A0DF" />
    </button>
  );
}

export default ScrollEffects;
