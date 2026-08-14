import { useEffect } from "react";
import Home from "../app/page";
import ContactPage from "../app/contact/page";
import ServicePage from "../app/services/[slug]/page";
import Terms from "../app/terms/page";
import Privacy from "../app/privacy/page";
import LeadsAdminPage from "../app/admin/leads/page";
import { Redirect, useRouter } from "./router";
import { trackEvent, trackPageView } from "./analytics";

const pageMetadata = [
  { match: (path) => path === "/", title: "SellNautix | Amazon Account Management & Advertising Services", description: "Grow and protect your Amazon business with expert account management, advertising optimisation, listing support, compliance guidance, training, and reinstatement services." },
  { match: (path) => path === "/contact", title: "Contact SellNautix | Growth Diagnostic", description: "Tell SellNautix about your Amazon growth opportunity." },
  { match: (path) => path === "/privacy", title: "Privacy Policy | SellNautix", description: "SellNautix privacy policy." },
  { match: (path) => path === "/terms", title: "Terms & Conditions | SellNautix", description: "SellNautix terms and conditions." },
  { match: (path) => path.startsWith("/services/"), title: "Amazon Services | SellNautix", description: "Amazon marketplace services from SellNautix." },
  { match: (path) => path === "/admin/leads", title: "Lead access | SellNautix", description: "Private SellNautix lead workspace." }
];

function RouteEffects() {
  const { location } = useRouter();

  useEffect(() => {
    const metadata = pageMetadata.find((item) => item.match(location.pathname)) || pageMetadata[0];
    document.title = metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", metadata.description);
    trackPageView(metadata);
    if (location.hash) {
      window.setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView(), 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

function OutboundEventTracking() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (href.startsWith("tel:")) {
        trackEvent("phone_link_click", { contact_method: "phone" });
      } else if (href.startsWith("mailto:")) {
        trackEvent("email_link_click", { contact_method: "email" });
      } else if (/^https?:\/\/(?:www\.)?linkedin\.com\//i.test(href)) {
        trackEvent("linkedin_link_click", { destination: "linkedin" });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

export default function App() {
  const { location } = useRouter();
  const { pathname } = location;
  let page = <Redirect to="/" replace />;

  if (pathname === "/") page = <Home />;
  else if (pathname === "/contact") page = <ContactPage />;
  else if (pathname.startsWith("/services/")) page = <ServicePage slug={decodeURIComponent(pathname.slice("/services/".length))} />;
  else if (pathname === "/privacy") page = <Privacy />;
  else if (pathname === "/terms") page = <Terms />;
  else if (pathname === "/admin/leads") page = <LeadsAdminPage />;

  return <><RouteEffects /><OutboundEventTracking />{page}</>;
}
