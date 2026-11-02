import { CalendarDays, CheckCircle2, LockKeyhole, Sparkles } from "lucide-react";
import PlanCards from "../../components/billing/PlanCards";
import { PRO_PRICE_LABEL, PRO_RATE_DATE } from "../../config/billing";

export default function Pricing() {
  return <section className="ahiia-pricing"><div className="ahiia-pricing-inner">
    <div className="ahiia-pricing-heading"><span className="ahiia-eyebrow"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE</span>
      <h1>Big ideas.<br />A <em>small monthly price.</em></h1>
      <p>Start with a business proposal. Unlock the full document toolkit when your business is ready for more.</p>
      <span className="ahiia-pricing-period"><i /> Simple monthly pricing. Charged in naira.</span>
    </div>
    <PlanCards />
    <div className="ahiia-pricing-trust"><span><LockKeyhole size={14} /> Secure checkout with Paystack</span><span><CalendarDays size={14} /> Monthly billing</span><span><CheckCircle2 size={14} /> Cancel renewal anytime</span></div>
    <div className="ahiia-pricing-faq"><div><h3>What can I create for free?</h3><p>Business Proposals are available on Free. Add your company profile and brand kit, refine the content with AI, and export your proposal.</p></div>
      <div><h3>What does Pro unlock?</h3><p>All six document types for {PRO_PRICE_LABEL} per month: proposals, business plans, pitch decks, SOPs, contracts and marketing plans.</p></div>
      <div><h3>How does monthly billing work?</h3><p>Your subscription renews monthly at {PRO_PRICE_LABEL} through Paystack. This fixed naira price is the $10 equivalent at the CBN NFEM rate published on {PRO_RATE_DATE}. It doesn’t change with daily exchange-rate movements.</p></div>
      <div><h3>What happens when I cancel?</h3><p>Renewal stops and Pro stays active until your paid month ends. Your saved documents remain available. You can continue creating Business Proposals on Free.</p></div></div>
  </div></section>;
}
