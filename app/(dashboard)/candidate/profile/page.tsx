"use client";

import { useUserWithLoading } from "@/hooks/useUser";
import ProfileCard from "@/components/profile-page/profile-card";
import EducationTimeline from "@/components/profile-page/education-card";
import ProfileBio from "@/components/profile-page/Bio";
import Certifications from "@/components/profile-page/certifications";
import EditProfileCard from "@/components/profile-page/edit-profile-card";
import { useState, useRef, useEffect } from "react";
import EditProfileBio from "@/components/profile-page/edit-bio";
import AddCertificationForm from "@/components/profile-page/edit-certifications/addCertification-form";
import EditCertificationForm from "@/components/profile-page/edit-certifications/editCertification-form";
import { Certification, Education, useUserStore } from "@/store/userStore";
import Spinner from "@/components/ui/spinner";
import CompleteProfileCard from "@/components/custom/completeProfileCard";
import EditEducationForm from "@/components/profile-page/edit-education/editEducation-form";
import AddEducationForm from "@/components/profile-page/edit-education/addEducation-form";

type EditSection = "profile" | "bio" | "education" | "certifications" | null;

export default function CandidateProfile() {
  const { user, isLoading } = useUserWithLoading();
  const [editSection, setEditSection] = useState<EditSection>(null);
  const [isAddingCertification, setIsAddingCertification] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const { refreshUser } = useUserStore();

  // Create refs for each editable section
  const bioRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const certificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Handle auto-scrolling when a section is opened for editing
  useEffect(() => {
    const scrollToSection = () => {
      if (editSection === "bio" && bioRef.current) {
        bioRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (editSection === "education" && educationRef.current) {
        educationRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (
        editSection === "certifications" &&
        certificationsRef.current
      ) {
        certificationsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (editSection === "profile" && profileRef.current) {
        profileRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // Add a small delay to ensure the DOM has updated
    const timer = setTimeout(scrollToSection, 100);
    return () => clearTimeout(timer);
  }, [editSection]);

  // Similar effect for adding/editing education or certifications
  useEffect(() => {
    if (isAddingEducation || editingEducation) {
      educationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (isAddingCertification || editingCertification) {
      certificationsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [
    isAddingEducation,
    editingEducation,
    isAddingCertification,
    editingCertification,
  ]);

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

  const handleCancelAddEducation = () => {
    setIsAddingEducation(false);
  };

  const handleCancelEditEducation = () => {
    setEditingEducation(null);
  };

  const handleProfileSectionClick = (section: string) => {
    if (section === "certifications") {
      setIsAddingCertification(true);
    } else if (section === "bio") {
      setEditSection("bio");
    } else if (section === "education") {
      if (
        !user?.education ||
        !Array.isArray(user.education) ||
        user.education.length === 0
      ) {
        setIsAddingEducation(true);
      } else {
        setEditSection("education");
      }
    } else {
      setEditSection(section as EditSection);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col overflow-hidden">
      <div ref={profileRef}>
        {editSection === "profile" ? (
          <EditProfileCard user={user} onEditComplete={handleEditComplete} />
        ) : (
          <ProfileCard
            user={user}
            onEditClick={() => handleEditClick("profile")}
          />
        )}
      </div>
      <div className="bg-slate-200 dark:bg-slate-800 text-black dark:text-white shadow p-6 rounded-b-xl">
        <CompleteProfileCard
          user={user}
          onEditClick={handleProfileSectionClick}
        />

        {/* Bio section */}
        <div ref={bioRef}>
          {user?.bio || editSection === "bio" ? (
            editSection === "bio" ? (
              <EditProfileBio
                bio={user?.bio || ""}
                onEditCencel={handleEditComplete}
              />
            ) : (
              <ProfileBio
                bio={user?.bio || ""}
                onEditClick={() => handleEditClick("bio")}
              />
            )
          ) : null}
        </div>

        {/* Education section */}
        <div ref={educationRef}>
          {isAddingEducation ? (
            <div className="mt-6">
              <AddEducationForm
                onCancel={handleCancelAddEducation}
                onSuccess={() => {
                  refreshUser();
                  setIsAddingEducation(false);
                }}
              />
            </div>
          ) : editingEducation ? (
            <div className="mt-6">
              <EditEducationForm
                education={editingEducation}
                onCancel={handleCancelEditEducation}
                onSuccess={() => {
                  refreshUser();
                  setEditingEducation(null);
                }}
              />
            </div>
          ) : (
            user?.education &&
            Array.isArray(user.education) &&
            user.education.length > 0 && (
              <EducationTimeline
                educationData={user.education}
                onEditClick={() => handleEditClick("education")}
              />
            )
          )}
        </div>

        {/* Certifications section */}
        <div ref={certificationsRef}>
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
    </div>
  );
}
