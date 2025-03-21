"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import { EmpProfileCard } from "@/components/employer-profile/emp-profile-card";
import { CompanyProfileCard } from "@/components/employer-profile/company-profile-card";
import { OpeningsCard } from "@/components/employer-profile/openings-card";
import { useState } from "react";
import { EditEmpProfileCard } from "@/components/employer-profile/edit-emp-profile";
import { EditCompanyProfileCard } from "@/components/employer-profile/edit-company-profile";
import Spinner from "@/components/ui/spinner";

type EditSection = "profile" | "company" | null;

export default function EmployerProfile() {
  const { user, isLoading } = useUserWithLoading();
  const [editSection, setEditSection] = useState<EditSection>(null);

  const handleEditClick = (section: EditSection) => {
    setEditSection(section);
  };

  const handleEditComplete = () => {
    setEditSection(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3 h-full">
      {editSection === "profile" ? (
        <EditEmpProfileCard user={user} onEditCancel={handleEditComplete} />
      ) : (
        <EmpProfileCard
          user={user}
          onEditClick={() => handleEditClick("profile")}
        />
      )}
      <div className="lg:col-span-2 space-y-6">
        {editSection === "company" ? (
          <EditCompanyProfileCard
            user={user}
            onEditCancel={handleEditComplete}
          />
        ) : (
          <CompanyProfileCard
            user={user}
            onEditClick={() => handleEditClick("company")}
          />
        )}
        <OpeningsCard user={user} />
      </div>
    </div>
  );
}
