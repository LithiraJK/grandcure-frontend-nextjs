export function MapWidget() {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#d8e4ee] bg-white shadow-soft">
      <div className="h-48 bg-[radial-gradient(circle_at_20%_15%,#d8ebd8_0,#d8ebd8_20%,transparent_21%),radial-gradient(circle_at_70%_40%,#d1e8f5_0,#d1e8f5_18%,transparent_19%),linear-gradient(145deg,#c8dfc8,#a7d0a8)]" />
      <div className="px-4 py-3">
        <p className="inline-flex items-center rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600">
          3 High Priority Tasks Near You
        </p>
        <p className="mt-2 text-xs text-secondary">Local Area Map Placeholder</p>
      </div>
    </section>
  );
}
