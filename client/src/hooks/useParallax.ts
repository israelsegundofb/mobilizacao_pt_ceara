import { useEffect, useRef, useState } from "react";

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calcula a posição do elemento na viewport
        const isVisible = elementTop < windowHeight && elementTop + elementHeight > 0;

        if (isVisible) {
          // Calcula o offset baseado na posição do scroll
          const scrollY = window.scrollY;
          const elementScrollPosition = scrollY + elementTop;
          const parallaxOffset = (scrollY - elementScrollPosition) * speed;
          setOffset(parallaxOffset);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return { ref, offset };
}
