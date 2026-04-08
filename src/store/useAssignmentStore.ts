import { create } from "zustand";

export type AssignmentPriority = "URGENT" | "STANDARD" | "RECURRING";
export type AssignmentStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Assignment = {
  id: string;
  title: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  patientName: string;
  patientAge: number;
  distanceMiles: number;
  address: string;
  note: string;
  etaLabel: string;
  fee: number;
  createdAtLabel: string;
};

type AssignmentState = {
  assignments: Assignment[];
  isLoading: boolean;
  fetchPendingRequests: () => Promise<void>;
  acceptAssignment: (assignmentId: string) => void;
  rejectAssignment: (assignmentId: string) => void;
};

const mockPendingAssignments: Assignment[] = [
  {
    id: "urgent-respiratory-assistance",
    title: "Respiratory Assistance Needed",
    priority: "URGENT",
    status: "PENDING",
    patientName: "Arthur M",
    patientAge: 84,
    distanceMiles: 1.2,
    address: "422 Oakwood Dr, North Wing",
    note: "Difficulty breathing, nebulizer ready.",
    etaLabel: "ETA 7 min",
    fee: 58,
    createdAtLabel: "Just now",
  },
  {
    id: "standard-medication-reminder",
    title: "Medication Reminder",
    priority: "STANDARD",
    status: "PENDING",
    patientName: "Elena R",
    patientAge: 74,
    distanceMiles: 2.4,
    address: "Elm Grove Residence",
    note: "Daily medication check.",
    etaLabel: "15 min duration",
    fee: 25,
    createdAtLabel: "3 mins ago",
  },
  {
    id: "recurring-morning-grooming",
    title: "Morning Grooming",
    priority: "RECURRING",
    status: "PENDING",
    patientName: "James S",
    patientAge: 81,
    distanceMiles: 0.8,
    address: "Roseview Apartments",
    note: "Routine grooming support.",
    etaLabel: "45 min duration",
    fee: 48,
    createdAtLabel: "12 mins ago",
  },
];

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  isLoading: false,

  fetchPendingRequests: async () => {
    set({ isLoading: true });

    // Simulate API latency for the MVP dashboard experience.
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });

    set({ assignments: mockPendingAssignments, isLoading: false });
  },

  acceptAssignment: (assignmentId) => {
    set((state) => ({
      assignments: state.assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, status: "ACCEPTED" }
          : assignment,
      ),
    }));
  },

  rejectAssignment: (assignmentId) => {
    set((state) => ({
      assignments: state.assignments.map((assignment) =>
        assignment.id === assignmentId
          ? { ...assignment, status: "REJECTED" }
          : assignment,
      ),
    }));
  },
}));
