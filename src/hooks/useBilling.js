import { useEffect, useState } from "react";
import { getBilling } from "../services/billing.service";

export function useBilling() {
  const [state, setState] = useState({ billing: null, loading: true, error: "" });
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const billing = await getBilling();
        if (active) setState({ billing, loading: false, error: "" });
      } catch {
        if (active) setState({ billing: null, loading: false, error: "We couldn’t confirm your plan. Refresh to try again." });
      }
    };
    load();
    window.addEventListener("focus", load);
    return () => { active = false; window.removeEventListener("focus", load); };
  }, []);
  return state;
}
