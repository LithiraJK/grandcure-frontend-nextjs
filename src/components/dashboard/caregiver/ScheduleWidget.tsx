type ScheduleItem = {
  id: string;
  time: string;
  task: string;
  patient: string;
};

const upcomingSchedule: ScheduleItem[] = [
  {
    id: "physical-therapy",
    time: "14:30",
    task: "Physical Therapy",
    patient: "Anjan Jenkins",
  },
  {
    id: "meal-prep",
    time: "16:00",
    task: "Meal Prep",
    patient: "Robert Lee",
  },
  {
    id: "shift-end",
    time: "18:00",
    task: "Shift End",
    patient: "GrandCure Facility HQ",
  },
];

export function ScheduleWidget() {
  return (
    <section className="rounded-3xl border border-[#d8e4ee] bg-white p-5 shadow-soft sm:p-6">
      <h3 className="font-display text-xl font-extrabold tracking-tight text-zinc-900">
        Upcoming Schedule
      </h3>

      <ol className="mt-5 space-y-4">
        {upcomingSchedule.map((item) => (
          <li key={item.id} className="relative pl-6">
            <span
              className="absolute left-0 top-1 h-3 w-3 rounded-full bg-primary"
              aria-hidden="true"
            />
            <span
              className="absolute left-1.25 top-5 h-8 w-px bg-zinc-200 last:hidden"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-zinc-900">{item.time} - {item.task}</p>
            <p className="text-xs text-secondary">{item.patient}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
