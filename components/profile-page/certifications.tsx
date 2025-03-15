"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  Award,
  ExternalLink,
  Pencil,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import { vibrantColors } from "../custom/GlowCard";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { deleteCertification } from "@/api/user/deleteCertificate";
import { useUserStore } from "@/store/userStore";

interface Certification {
  source?: string;
  source_url?: string;
  date_obtained?: string; // Format: yyyy-mm-dd
  certification_name?: string;
}

interface CertificationsProps {
  certifications?: (string | Certification)[] | null | undefined;
  isEditing?: boolean;
  onEditClick?: () => void;
  onAddClick?: () => void;
  onEditCertificate?: (cert: Certification) => void;
  onDeleteCertificate?: (certName: string) => void;
}

export default function Certifications({
  certifications = [],
  isEditing = false,
  onEditClick,
  onAddClick,
  onEditCertificate,
  onDeleteCertificate,
}: CertificationsProps) {
  const [expanded, setExpanded] = useState(false);
  const [colors, setColors] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<string | null>(null);
  const { refreshUser } = useUserStore();

  // Format date from yyyy-mm-dd to a more readable format
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  // Sort certifications by date (newest first)
  const sortedCertifications = useMemo(() => {
    // Ensure we have a valid array to sort
    const certsToSort = Array.isArray(certifications) ? certifications : [];

    // Filter out string values
    const validCerts = certsToSort.filter(
      (cert): cert is Certification => typeof cert === "object" && cert !== null
    );

    return [...validCerts].sort((a, b) => {
      const dateA = a?.date_obtained ? new Date(a.date_obtained).getTime() : 0;
      const dateB = b?.date_obtained ? new Date(b.date_obtained).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });
  }, [certifications]);

  const displayedCertifications = expanded
    ? sortedCertifications
    : sortedCertifications.slice(0, 3);

  useEffect(() => {
    const generatedColors = sortedCertifications.map(() => {
      const randomIndex = Math.floor(Math.random() * vibrantColors.length);
      return vibrantColors[randomIndex];
    });
    setColors(generatedColors);
  }, [sortedCertifications]);

  const handleDeleteClick = (certName: string | undefined) => {
    if (!certName) return;
    setCertToDelete(certName);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!certToDelete) return;

    try {
      await deleteCertification(certToDelete);
      await refreshUser();
      toast.success("Certification deleted successfully");
      if (onDeleteCertificate) onDeleteCertificate(certToDelete);
    } catch {
      toast.error("Failed to delete certification");
    } finally {
      setDeleteConfirmOpen(false);
      setCertToDelete(null);
    }
  };

  if (!sortedCertifications || sortedCertifications.length === 0) {
    if (isEditing) {
      return (
        <div className="py-16 px-4">
          <h2 className="text-foreground font-aclonica text-5xl font-bold mb-10 text-center">
            My Certifications
          </h2>
          <div className="flex justify-center">
            <Button
              onClick={onAddClick}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center gap-2"
            >
              <Plus size={16} /> Add Certification
            </Button>
          </div>
        </div>
      );
    }
    return null; // Or a placeholder message when no certifications are provided
  }

  return (
    <div className="py-16 px-4 relative">
      <h2 className="text-foreground font-aclonica text-4xl md:text-6xl font-bold mb-10 text-start">
        My Certifications
      </h2>

      {isEditing ? (
        <Button
          onClick={onEditClick}
          variant="outline"
          size="icon"
          className="absolute top-16 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Cancel Editing"
        >
          <X size={18} />
        </Button>
      ) : (
        <Button
          onClick={onEditClick}
          variant="outline"
          size="icon"
          className="absolute top-16 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Certifications"
        >
          <Pencil size={18} />
        </Button>
      )}

      {isEditing && (
        <div className="flex justify-center mb-6">
          <Button
            onClick={onAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full z-10 shadow-md flex items-center gap-2"
            title="Add Certification"
          >
            <Plus size={16} /> Add Certification
          </Button>
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this certification from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {displayedCertifications.map((cert, index) => {
          const cardColor = colors[index];
          const CardWrapper = ({ children }: { children: React.ReactNode }) => {
            return cert.source_url && !isEditing ? (
              <Link
                href={cert.source_url}
                rel="noopener noreferrer"
                target="_blank"
                className="block h-full transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {children}
              </Link>
            ) : (
              <div className="h-full">{children}</div>
            );
          };

          return (
            <div
              key={index}
              className="group relative transform perspective-800 transition-transform duration-400 hover:rotate-y-5"
            >
              <CardWrapper>
                <div
                  className="relative h-full z-10 overflow-hidden bg-card bg-opacity-20 backdrop-blur-sm border border-primary/30 p-6 rounded-lg shadow-md dark:bg-gray-900 bg-gray-100
                    hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  style={{
                    borderColor: `${cardColor}30`,
                  }}
                >
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-1 z-20">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:text-blue-500 rounded-full shadow-sm"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation when clicking button
                          e.stopPropagation(); // Stop event bubbling
                          onEditCertificate?.(cert);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:text-red-500 rounded-full shadow-sm"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent link navigation when clicking button
                          e.stopPropagation(); // Stop event bubbling
                          handleDeleteClick(cert.certification_name);
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-start mb-3">
                    <Award style={{ color: cardColor }} className="h-8 w-8" />
                  </div>

                  <h3 className="text-card-foreground text-xl font-semibold mb-2">
                    {cert.certification_name}
                  </h3>

                  <div className="flex items-center text-muted-foreground text-sm">
                    <span>{cert.source}</span>
                    {cert.source_url && !isEditing && (
                      <ExternalLink className="h-3 w-3 ml-1 inline" />
                    )}
                  </div>

                  {/* Date at bottom right */}
                  <div className="absolute bottom-4 right-6">
                    <span style={{ color: cardColor }} className="text-sm">
                      {formatDate(cert.date_obtained)}
                    </span>
                  </div>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(45deg, ${cardColor}10, ${cardColor}20)`,
                    }}
                  ></div>

                  <div
                    className="absolute -inset-2 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                    style={{
                      background: `linear-gradient(45deg, ${cardColor}20, transparent)`,
                    }}
                  ></div>
                </div>
              </CardWrapper>
            </div>
          );
        })}
      </div>

      {sortedCertifications.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 mx-auto mt-8 text-primary hover:text-primary/80 transition-colors"
        >
          <span>{expanded ? "Show Less" : "Show More"}</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
}
