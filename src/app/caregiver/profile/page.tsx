import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/routes";

export default function CaregiverProfilePage() {
  redirect(ROUTES.caregiverProfile);
}
