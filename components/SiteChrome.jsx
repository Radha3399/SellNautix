"use client";
import Link from "next/link";
import { useState } from "react";

export function Mark() { return <Link href="/" className="mark" aria-label="SellNautix home"><span className="mark-orbit">S</span><span>SELL<span>NAUTIX</span></span></Link>; }

export function Header() {
  const [open, setOpen] = useState(false);
  const links = [["Services", "/#services"], ["Training", "/#training"], ["Process", "/#process"], ["Results", "/#testimonials"]];
  return <header className="topbar"><div className="wrap nav"><Mark /><button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open navigation"><i></i><i></i></button><nav className={open ? "navlinks open" : "navlinks"}>{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/contact" className="button button-small" onClick={() => setOpen(false)}>Get a Growth Diagnostic <span>↗</span></Link></nav></div></header>;
}

export function Footer() { return <footer className="footer"><div className="wrap footer-grid"><div><Mark /><p>Practical Amazon marketplace operations, growth strategy, and seller training.</p><a className="footer-linkedin" href="https://www.linkedin.com/in/suyogpbhandari" target="_blank" rel="noreferrer">in &nbsp; LinkedIn</a></div><div><p className="eyebrow">Explore</p><Link href="/#about">About</Link><Link href="/#services">Services</Link><Link href="/#training">Training</Link><Link href="/#testimonials">Testimonials</Link><Link href="/contact">Contact</Link></div><div><p className="eyebrow">Contact SellNautix</p><a href="mailto:yousuyogbhandari@gmail.com">yousuyogbhandari@gmail.com</a><a href="tel:+919960514466">+91 99605 14466</a><p className="subtle">Maharshi Nagar, Pune<br/>Maharashtra, India</p></div></div><div className="wrap copyright"><span>© {new Date().getFullYear()} SellNautix. All rights reserved.</span><span><Link href="/privacy">Privacy Policy</Link> &nbsp;·&nbsp; <Link href="/terms">Terms & Conditions</Link></span></div></footer>; }
