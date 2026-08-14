import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { trackEvent } from "./analytics";

const RouterContext = createContext(null);
const readLocation = () => ({ pathname: window.location.pathname, hash: window.location.hash, search: window.location.search });

export function Router({ children }) {
  const [location, setLocation] = useState(readLocation);
  const navigate = useCallback((to, { replace = false } = {}) => {
    const target = new URL(to, window.location.origin);
    const href = `${target.pathname}${target.search}${target.hash}`;
    window.history[replace ? "replaceState" : "pushState"]({}, "", href);
    setLocation(readLocation());
  }, []);

  useEffect(() => {
    const onPopState = () => setLocation(readLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error("Router components must be rendered inside Router.");
  return value;
}

export function Link({ to, onClick, replace, ...props }) {
  const { navigate } = useRouter();
  return <a href={to} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target || !to.startsWith("/")) return;
    if (to === "/contact") {
      trackEvent("contact_cta_click", {
        cta_text: event.currentTarget.textContent?.replace(/\s+/g, " ").trim().slice(0, 100) || "Contact"
      });
    }
    event.preventDefault();
    navigate(to, { replace });
  }} {...props} />;
}

export function Redirect({ to, replace = false }) {
  const { navigate } = useRouter();
  useEffect(() => navigate(to, { replace }), [navigate, replace, to]);
  return null;
}
