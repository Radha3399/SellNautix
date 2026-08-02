import { Link, Redirect } from "../../../src/router";
import { Header, Footer } from "../../../components/SiteChrome";
import { services, serviceDetails } from "../../../lib/data";

export default function ServicePage({ slug }) {
  const service = services.find((item) => item.slug === slug);

  if (!service) return <Redirect to="/" replace />;

  const extra = serviceDetails[service.id];
  return <><Header /><main className="service-page"><section className="service-hero"><div className="wrap"><Link className="back-link" to="/#services">← All services</Link><p className="eyebrow light">{service.id}</p><h1>{service.name}</h1><p>{service.details}</p><div className="service-price-hero"><span>Starting from</span><strong>{service.price}</strong><small>{service.model}</small></div><Link to="/contact" className="button">Schedule a Consultation <span>↗</span></Link></div></section><section className="section"><div className="wrap service-details"><div><p className="eyebrow">Designed for</p><h2>{service.bestFor}</h2></div><dl><div><dt>Starting from</dt><dd>{service.price}</dd></div><div><dt>Engagement</dt><dd>{service.model}</dd></div><div><dt>Typical timeline</dt><dd>{service.timeline}</dd></div></dl></div></section><section className="service-inclusions"><div className="wrap inclusion-grid"><div><p className="eyebrow">Core offerings</p><h2>What&apos;s included</h2><ul>{extra.offerings.map((item) => <li key={item}>{item}</li>)}</ul></div><div><p className="eyebrow">Benefits for sellers</p><h2>What this helps unlock</h2><ul>{extra.benefits.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section><section className="service-end"><div className="wrap"><p>Need help choosing the right first step?</p><Link to="/contact" className="text-link light">Get a focused Growth Diagnostic <span>↗</span></Link></div></section></main><Footer /></>;
}
