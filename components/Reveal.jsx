import { useEffect, useRef } from "react";

export default function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => { const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); } }, { threshold: .12 }); if (ref.current) io.observe(ref.current); return () => io.disconnect(); }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` }}>{children}</div>;
}
