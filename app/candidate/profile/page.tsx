"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import ProfileCard from "@/components/profile-page/profile-card";
import EducationTimeline from "@/components/profile-page/education-card";
import ProfileBio from "@/components/profile-page/Bio";
import Certifications from "@/components/profile-page/certifications";
import EditProfileCard from "@/components/profile-page/edit-profile-card";
import { useState } from "react";
import EditProfileBio from "@/components/profile-page/edit-bio";
import AddCertificationForm from "@/components/profile-page/edit-certifications/addCertification-form";
import EditCertificationForm from "@/components/profile-page/edit-certifications/editCertification-form";
import { useUserStore } from "@/store/userStore";
import Spinner from "@/components/ui/spinner";

interface Certification {
  source?: string;
  source_url?: string;
  date_obtained?: string;
  certification_name?: string;
}

type EditSection = "profile" | "bio" | "education" | "certifications" | null;

export default function CandidateProfile() {
  const { user, isLoading } = useUserWithLoading();
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const { refreshUser } = useUserStore();

  const handleEditClick = (section: EditSection) => {
    setEditSection(section);
  };

  const handleEditComplete = () => {
    setEditSection(null);
  };

  const handleAddCertificationClick = () => {
    setIsAddingCertification(true);
  };

  const handleCancelAddCertification = () => {
    setIsAddingCertification(false);
  };

  const handleEditCertification = (cert: Certification) => {
    setEditingCertification(cert);
  };

  const handleCancelEditCertification = () => {
    setEditingCertification(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col overflow-hidden">
      {editSection === "profile" ? (
        <EditProfileCard user={user} onEditComplete={handleEditComplete} />
      ) : (
        <ProfileCard
          user={user}
          onEditClick={() => handleEditClick("profile")}
        />
      )}
      <div className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow p-6 rounded-b-xl">
        {editSection === "bio" ? (
          <EditProfileBio
            bio={user?.bio || ""}
            onEditCencel={handleEditComplete}
          />
        ) : (
          <ProfileBio
            bio={user?.bio || ""}
            onEditClick={() => handleEditClick("bio")}
          />
        )}

        <EducationTimeline
          educationData={user?.education}
          onEditClick={() => handleEditClick("education")}
        />

        {isAddingCertification ? (
          <AddCertificationForm
            onCancel={handleCancelAddCertification}
            onSuccess={() => {
              refreshUser();
              setIsAddingCertification(false);
            }}
          />
        ) : editingCertification ? (
          <EditCertificationForm
            certification={editingCertification}
            onCancel={handleCancelEditCertification}
            onSuccess={() => {
              refreshUser();
              setEditingCertification(null);
            }}
          />
        ) : (
          user?.certifications && (
            <Certifications
              certifications={user.certifications}
              isEditing={editSection === "certifications"}
              onEditClick={() =>
                handleEditClick(
                  editSection === "certifications" ? null : "certifications"
                )
              }
              onAddClick={handleAddCertificationClick}
              onEditCertificate={handleEditCertification}
              onDeleteCertificate={() => refreshUser()}
            />
          )
        )}
      </div>
    </div>
  );
}
