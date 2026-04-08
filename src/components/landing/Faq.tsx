import { Minus, Plus } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
  defaultOpen?: boolean;
};

const leftColumnFaqs: FaqItem[] = [
  {
    question: "What Grand Care services do you provide?",
    answer:
      "We offer doctor consultations, nursing care, attendant services, physical therapy, emergency response, and medication support. Services are available both at home and through virtual consultation support.",
    defaultOpen: true,
  },
  {
    question: "Is the consultation online or offline?",
    answer:
      "Both options are available. You can choose virtual consultations or in-person visits based on your care plan and provider availability.",
  },
 
  {
    question: "Can I request a specific Grand Care professional?",
    answer:
      "Yes, you can request a preferred professional based on availability and prior care history. You can also save preferred professionals in your profile.",
    defaultOpen: true,
  },
   {
    question: "Do you provide emergency medical services or urgent care?",
    answer:
      "Yes. We provide urgent care coordination and priority support where available, with rapid response workflows for emergency requests.",
  },
];

const rightColumnFaqs: FaqItem[] = [
  {
    question: "How can I schedule an appointment?",
    answer:
      "You can schedule appointments through our website, mobile app, or customer support line. We offer same-day options for urgent needs and advance booking for routine check-ups.",
    defaultOpen: true,
  },
  {
    question: "What are your service charges?",
    answer:
      "Charges vary depending on service type and duration. We provide transparent pricing with no hidden fees and flexible payment options.",
    defaultOpen: true,
  },
  {
    question: "What qualifications do your Grand Care professionals have?",
    answer:
      "All professionals are verified and credential-checked, with role-specific certifications and ongoing quality reviews.",
  },
  {
    question: "Is my medical data secure in your app?",
    answer:
      "Yes. We use encrypted storage, secure authentication, and strict access controls to protect your medical and personal data.",
  },
 
];

function FaqColumn({ items }: { items: FaqItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <details
          key={item.question}
          open={item.defaultOpen}
          className="group border-b border-[#c8dcf0] pb-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-left">
            <span className="text-lg font-bold leading-snug tracking-tight text-[#2a3340] sm:text-xl">
              {item.question}
            </span>
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-[#4b8bd8]">
              <Plus className="h-5 w-5 group-open:hidden" />
              <Minus className="hidden h-5 w-5 group-open:block" />
            </span>
          </summary>
          <p className="pr-10 text-base leading-relaxed text-[#647183]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-[#f3f6fa] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-[#1f2b3d] sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#607085] sm:text-lg">
            Find answers to common questions about our services, appointments, and Grand Care
            options.
          </p>
          <div className="mx-auto mt-5 h-1 w-18 rounded-full bg-[#5e9ae3]" />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-11">
          <FaqColumn items={leftColumnFaqs} />
          <FaqColumn items={rightColumnFaqs} />
        </div>
      </div>
    </section>
  );
}