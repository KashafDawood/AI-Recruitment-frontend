import React from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Mail,
  Dribbble,
  Twitch,
  MessageSquare,
  LucideIcon,
} from "lucide-react";

// Map platform names to icons using a type-safe approach
const iconMap: Record<string, LucideIcon> = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  dribbble: Dribbble,
  twitch: Twitch,
  discord: MessageSquare,
  email: Mail,
  website: Globe,
};

interface SocialIconProps {
  platform: string;
  size?: number;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  size = 16,
  className = "",
}) => {
  const normalizedPlatform = platform?.toLowerCase() || "";
  const IconComponent = iconMap[normalizedPlatform] || Globe;

  return <IconComponent size={size} className={className} />;
};

export default SocialIcon;
