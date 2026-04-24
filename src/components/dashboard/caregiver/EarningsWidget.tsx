type EarningLineItem = {
  label: string;
  value: number;
};

const earningBreakdown: EarningLineItem[] = [
  { label: "Shift Base", value: 180 },
  { label: "Urgent Premiums", value: 140 },
  { label: "Incentives", value: 22.5 },
];

const totalEarnings = earningBreakdown.reduce((sum, item) => sum + item.value, 0);

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function EarningsWidget() {
  return (
    <section className="rounded-3xl bg-primary p-5 text-white shadow-soft sm:p-6">
      <p className="text-sm font-semibold text-cyan-100">Today&apos;s Earnings</p>
      <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
        {formatCurrency(totalEarnings)}
      </p>

      <ul className="mt-5 space-y-3">
        {earningBreakdown.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-cyan-100">{item.label}</span>
            <span className="font-semibold">{formatCurrency(item.value)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
