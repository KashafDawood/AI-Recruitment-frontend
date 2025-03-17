"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import { EmpProfileCard } from "@/components/employer-profile/emp-profile-card";
import { CompanyProfileCard } from "@/components/employer-profile/company-profile-card";
import { OpeningsCard } from "@/components/employer-profile/openings-card";
import { useState } from "react";
import { EditEmpProfileCard } from "@/components/employer-profile/edit-emp-profile";

type EditSection = "profile" | "about" | null;

export default function EmployerProfile() {
  const { user } = useUserWithLoading();
  const [editSection, setEditSection] = useState<EditSection>(null);

  const handleEditClick = (section: EditSection) => {
    setEditSection(section);
  };

  const handleEditComplete = () => {
    setEditSection(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {editSection ? (
        <EditEmpProfileCard user={user} onEditCancel={handleEditComplete} />
      ) : (
        <EmpProfileCard
          user={user}
          onEditClick={() => handleEditClick("profile")}
        />
      )}
      <div className="md:col-span-2 space-y-6">
        <CompanyProfileCard user={user} />
        <OpeningsCard user={user} />
      </div>
    </div>
  );
}
