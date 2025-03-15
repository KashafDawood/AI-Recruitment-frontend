"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
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

interface Certification {
  source?: string;
  source_url?: string;
  date_obtained?: string;
  certification_name?: string;
}

// Define edit section types
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
    return (
      <div className="space-y-4 p-6">
        {/* Profile Card Skeleton */}
        <div className="rounded-t-xl overflow-hidden">
          <Skeleton className="h-40 w-full" /> {/* Banner */}
          <div className="bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" /> {/* Avatar */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" /> {/* Name */}
                <Skeleton className="h-4 w-72" /> {/* Title */}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" /> {/* Details */}
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Bio Section Skeleton */}
        <div className="bg-slate-200 dark:bg-slate-800 p-6 rounded-b-xl">
          <Skeleton className="h-8 w-40 mb-6" /> {/* Section Title */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" /> {/* Bio paragraph */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* Education Timeline Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-8 w-32 mb-4" /> {/* Education Title */}
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
