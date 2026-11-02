import { Link } from "react-router-dom";
import { ArrowUpRight, Check, FileText, Sparkles } from "lucide-react";
import { DOCUMENT_ACCESS, PRO_PRICE, PRO_PRICE_LABEL } from "../../config/billing";
import "./billing.css";

export default function PlanCards({ dashboard = false, pro = false, busy = false, checkoutAvailable = true, onUpgrade }) {
  return <div className="ahiia-plans">
    <article className="ahiia-plan-card ahiia-plan-free">
      <div className="ahiia-plan-top"><span className="ahiia-plan-icon"><FileText size={21} /></span><span className="ahiia-plan-label">A confident first step</span></div>
      <h2>Free</h2><p className="ahiia-plan-description">Turn your next opportunity into a well-crafted proposal.</p>
      <p className="ahiia-plan-price">$0<span> / always</span></p><p className="ahiia-price-note">No card needed</p>
      <div className="ahiia-plan-rule" />
      <ul className="ahiia-plan-features"><li><Check size={17} />Business Proposal generation</li><li><Check size={17} />Your company context and branding</li><li><Check size={17} />AI assistance for your proposals</li><li><Check size={17} />Document editing and exports</li></ul>
      {dashboard ? <Link to="/dashboard/create-document/business-proposal" className="ahiia-plan-button ahiia-button-outline">Create a proposal <ArrowUpRight size={17} /></Link>
        : <Link to="/signup" className="ahiia-plan-button ahiia-button-outline">Start for free <ArrowUpRight size={17} /></Link>}
    </article>
    <article className="ahiia-plan-card ahiia-plan-pro">
      <div className="ahiia-plan-top"><span className="ahiia-plan-icon"><Sparkles size={21} /></span><span className="ahiia-pro-badge">THE COMPLETE TOOLKIT</span></div>
      <h2>Pro</h2><p className="ahiia-plan-description">From your first pitch to your daily operations. One plan.</p>
      <p className="ahiia-plan-price ahiia-plan-price-naira">{PRO_PRICE_LABEL}<span> / month</span></p><p className="ahiia-price-note">≈ US${PRO_PRICE} · Charged in NGN · Cancel renewal anytime</p>
      <div className="ahiia-plan-rule" />
      <p className="ahiia-feature-eyebrow">Everything in Free, plus</p>
      <ul className="ahiia-plan-features">{DOCUMENT_ACCESS.filter((item) => !item.free).map((item) => <li key={item.type}><Check size={17} />{item.label}</li>)}</ul>
      {dashboard ? <button type="button" disabled={busy || pro || !checkoutAvailable} onClick={onUpgrade} className="ahiia-plan-button ahiia-button-light">{busy ? "Opening secure checkout…" : pro ? "Your current plan" : !checkoutAvailable ? "Checkout currently unavailable" : "Upgrade to Pro"}{!busy && !pro && <ArrowUpRight size={17} />}</button>
        : <Link to="/dashboard/billing" className="ahiia-plan-button ahiia-button-light">Get Pro <ArrowUpRight size={17} /></Link>}
    </article>
  </div>;
}
