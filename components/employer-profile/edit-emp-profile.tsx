import Link from "next/link";
import { Globe, Mail, Phone, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "@/store/userStore";
import React, { useState } from "react";
import { Button } from "../ui/button";
import ProfileImageSection from "../profile-page/edit-profile-card/ProfileImageSection";

type EditProfileCardProps = {
  user: User | null;
  onEditCancel?: () => void;
  onChange?: (file: File | null) => void;
};

export const EditEmpProfileCard: React.FC<EditProfileCardProps> = ({
  user,
  onEditCancel,
  onChange,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    } else {
      setPreview(null);
      setFile(null);
    }

    if (onChange) onChange(selectedFile);
  };

  return (
    <Card className="relative">
      {onEditCancel && (
        <Button
          onClick={onEditCancel}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-20 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Edit Profile"
        >
          <X size={18} />
        </Button>
      )}
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <ProfileImageSection
            user={user}
            preview={preview}
            onChange={handleChangeFile}
          />
          <h1 className="text-2xl font-bold mt-3">{user?.name}</h1>
          <p className="text-muted-foreground">@{user?.username}</p>
        </div>
      </CardContent>
      <CardHeader>
        <h2 className="text-xl font-semibold">Contact Information</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Email</p>
            <Link
              href={`mailto:${user?.email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {user?.email}
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Phone</p>
            <Link href={`tel:${user?.phone}`} className="text-sm">
              {user?.phone}
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Website</p>
            <Link
              href={user?.website || "#"}
              target="_blank"
              className="text-sm"
            >
              {user?.website}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
