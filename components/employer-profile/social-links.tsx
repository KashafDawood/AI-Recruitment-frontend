import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialLinksProps {
  socials: { [key: string]: string };
  onChange: (platform: string, value: string) => void;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socials, onChange }) => {
  const platforms = [
    { id: "linkedin", label: "LinkedIn" },
    { id: "twitter", label: "Twitter" },
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map((platform) => (
        <div key={platform.id} className="space-y-2">
          <Label htmlFor={platform.id}>{platform.label}</Label>
          <Input
            id={platform.id}
            name={platform.id}
            placeholder={`${platform.label} URL`}
            value={socials[platform.id] || ""}
            onChange={(e) => onChange(platform.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default SocialLinks;
