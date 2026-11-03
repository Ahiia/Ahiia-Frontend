import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, CircleAlert, CreditCard, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import PlanCards from "../../components/billing/PlanCards";
import { cancelSubscription, getBilling, manageSubscription, startCheckout, verifyPayment } from "../../services/billing.service";
import { paymentMessage, PRO_PRICE_LABEL } from "../../config/billing";

const date = (value) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";
const errorText = (error) => error?.response?.data?.message || error?.message || "Billing could not be loaded. Please try again.";

export default function Billing() {
  const location = useLocation();
  const reference = new URLSearchParams(location.search).get("reference") || new URLSearchParams(location.search).get("trxref");
  const isReturn = location.pathname.endsWith("/return");
  const [billing, setBilling] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      if (isReturn && reference) {
        const result = await verifyPayment(reference);
        setBilling(result.billing); setPaymentStatus(result.paymentStatus);
      } else { setBilling(await getBilling()); }
    } catch (err) { setError(errorText(err)); }
    finally { setLoading(false); }
  }, [isReturn, reference]);

  useEffect(() => {
    let active = true;
    let timer;
    let attempts = 0;
    const fetch = async () => {
      try {
        const result = isReturn && reference ? await verifyPayment(reference) : null;
        const current = result?.billing || await getBilling();
        if (!active) return;
        setBilling(current); setPaymentStatus(result?.paymentStatus || null); setError("");
        if (result?.paymentStatus === "Pending" && ++attempts < 6) timer = setTimeout(fetch, 3000);
      } catch (err) { if (active) setError(errorText(err)); }
      finally { if (active) setLoading(false); }
    };
    fetch();
    return () => { active = false; clearTimeout(timer); };
  }, [isReturn, reference]);

  const action = async (work) => {
    setBusy(true); setError("");
    try { await work(); } catch (err) { setError(errorText(err)); }
    finally { setBusy(false); }
  };
  const upgrade = () => action(async () => { const result = await startCheckout(); window.location.assign(result.checkoutUrl); });
  const cancel = () => action(async () => { setBilling(await cancelSubscription()); setConfirmCancel(false); });
  const manage = () => action(async () => { const result = await manageSubscription(); window.location.assign(result.url); });
  const pro = billing?.plan === "Pro";
  const notice = paymentStatus ? paymentMessage(paymentStatus) : null;

  return <div className="ahiia-billing">
    <div className="ahiia-billing-header"><div><span className="ahiia-eyebrow"><CreditCard size={13} /> YOUR WORKSPACE, YOUR PLAN</span><h1>Plans & billing</h1><p className="ahiia-billing-subtitle">A little investment in your next big move.</p></div>
      <span className="ahiia-status-pill"><ShieldCheck size={12} style={{ display: "inline", marginRight: 5 }} />Payments secured by Paystack</span></div>
    {error && <div role="alert" className="ahiia-billing-notice error"><CircleAlert size={19} /><div><strong>We couldn’t complete that request</strong><p>{error}</p><button type="button" className="ahiia-text-button" disabled={loading || busy} onClick={load}>Try again</button></div></div>}
    {isReturn && !reference && <div role="status" className="ahiia-billing-notice pending"><CircleAlert size={19} /><div><strong>No payment reference was returned</strong><p>Check your payment history below. Contact support if you were charged and your plan hasn’t updated.</p></div></div>}
    {notice && <div role="status" className={`ahiia-billing-notice ${notice.tone}`}>{notice.tone === "success" ? <CheckCircle2 size={21} /> : <CircleAlert size={21} />}<div><strong>{notice.title}</strong><p>{notice.detail}</p><button type="button" className="ahiia-text-button" disabled={loading || busy} onClick={load}>Refresh payment status</button>{paymentStatus === "Paid" && <Link to="/dashboard/create-document" className="ahiia-text-button" style={{ marginLeft: 18 }}>Create a document</Link>}</div></div>}
    {loading && !billing ? <div role="status" className="ahiia-billing-summary"><Loader2 size={20} /> Loading your billing details…</div> : billing && <>
      <div className="ahiia-billing-summary"><div><strong>{pro ? "You’re on Pro" : "You’re on Free"}</strong><p>{pro ? `${billing.cancelAtPeriodEnd ? "Pro access ends" : "Paid access through"} ${date(billing.paidUntil)}. ${billing.cancelAtPeriodEnd ? "Your subscription will not renew." : `${PRO_PRICE_LABEL} plus Paystack processing fees, billed monthly.`}` : "Business Proposals are yours to create. Unlock all six document types with Pro."}</p>{billing.status === "PaymentFailed" && <p>Your latest renewal failed. Update your payment method to continue Pro.</p>}</div><span className="ahiia-status-pill">{pro ? billing.cancelAtPeriodEnd ? "Renewal cancelled" : "Pro active" : "Free plan"}</span></div>
      <PlanCards dashboard pro={pro} busy={busy} checkoutAvailable={billing.checkoutAvailable} onUpgrade={upgrade} />
      <div className="ahiia-billing-actions"><button type="button" className="ahiia-text-button" onClick={load} disabled={loading || busy}><RefreshCw size={12} style={{ display: "inline", marginRight: 5 }} />Refresh billing</button>{billing.paidUntil && <button type="button" className="ahiia-text-button" disabled={busy} onClick={manage}>Manage payment method</button>}{pro && !billing.cancelAtPeriodEnd && <button type="button" className="ahiia-text-button" disabled={busy} onClick={() => setConfirmCancel(true)}>Cancel renewal</button>}</div>
      {confirmCancel && <div className="ahiia-cancel-panel"><p><strong>Cancel your monthly renewal?</strong><br />You’ll keep Pro until {date(billing.paidUntil)}. After that, you can still view and export saved documents and create free Business Proposals.</p><div><button type="button" className="ahiia-text-button" disabled={busy} onClick={cancel}>{busy ? "Cancelling…" : "Yes, cancel renewal"}</button><button type="button" className="ahiia-text-button" disabled={busy} onClick={() => setConfirmCancel(false)}>Keep Pro</button></div></div>}
      <section className="ahiia-billing-history"><h2>Payment history</h2>{billing.payments.length ? <div className="ahiia-history-scroll"><table><thead><tr><th>Date</th><th>Reference</th><th>Total incl. fees</th><th>Status</th></tr></thead><tbody>{billing.payments.map((payment) => <tr key={payment.reference}><td>{date(payment.paidAt || payment.createdAt)}</td><td className="ahiia-reference">{payment.reference}</td><td>{new Intl.NumberFormat(undefined, { style: "currency", currency: payment.currency }).format((payment.totalAmount ?? payment.amount) / 100)}</td><td>{payment.status}</td></tr>)}</tbody></table></div> : <p className="ahiia-history-empty">Your payments will appear here. You’re currently using Ahiia for free.</p>}</section>
    </>}
  </div>;
}
