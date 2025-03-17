"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import { EmpProfileCard } from "@/components/employer-profile/emp-profile-card";
import { CompanyProfileCard } from "@/components/employer-profile/company-profile-card";
import { OpeningsCard } from "@/components/employer-profile/openings-card";

export default function EmployerProfile() {
  const { user } = useUserWithLoading();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <EmpProfileCard user={user} />
      <div className="md:col-span-2 space-y-6">
        <CompanyProfileCard user={user} />
        <OpeningsCard user={user} />
      </div>
    </div>
  );
}
