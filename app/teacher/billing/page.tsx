"use client";

const plans = [
  {
    name: "Standard",
    price: "₹899/mo",
    features: ["Manual quiz builder", "PDF uploads (5/mo)", "Basic analytics"],
    cta: "Current Plan",
  },
  {
    name: "Premium",
    price: "₹1,999/mo",
    features: ["Unlimited PDF → Quiz", "AI question generator", "Live proctoring & anti-cheat", "Advanced analytics"],
    cta: "Upgrade now",
  },
];

const invoices = [
  { id: "INV-2043", date: "01 Nov 2025", amount: "₹899", status: "Paid" },
  { id: "INV-2032", date: "01 Oct 2025", amount: "₹899", status: "Paid" },
  { id: "INV-2021", date: "01 Sep 2025", amount: "₹899", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Subscription & Billing</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Manage plan, renew, and download invoices</h1>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Need help?</button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">{plan.name}</p>
                <p className="text-3xl font-black text-white">{plan.price}</p>
              </div>
              <button
                className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                  plan.name === "Premium" ? "bg-white text-slate-900" : "border border-white/20 text-white/70"
                }`}
              >
                {plan.cta}
              </button>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Billing history</p>
            <h3 className="text-2xl font-bold text-white">Past invoices</h3>
          </div>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Download all</button>
        </div>
        <div className="mt-6 space-y-3 text-sm text-white/80">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{invoice.id}</p>
                <p className="text-white/60">{invoice.date}</p>
              </div>
              <p>{invoice.amount}</p>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">{invoice.status}</span>
              <button className="rounded-2xl border border-white/20 px-3 py-1 text-xs text-white/80">Download</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

