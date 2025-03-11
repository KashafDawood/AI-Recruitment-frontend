import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X, Check } from "lucide-react";
import Link from "next/link";
import SocialIcon from "../../social-icon/social-icon";

type SocialMediaSectionProps = {
  socials: Record<string, string>;
  setSocials: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socials,
  setSocials,
}) => {
  const [showSocialInput, setShowSocialInput] = useState(false);
  const [newSocialData, setNewSocialData] = useState({ platform: "", url: "" });
  const socialInputRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract platform from URL
  const extractPlatformFromUrl = (url: string): string => {
    try {
      // Add https:// prefix if missing
      let urlValue = url;
      if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://")) {
        urlValue = "https://" + urlValue;
      }

      const urlObj = new URL(urlValue);
      return urlObj.hostname.replace("www.", "").split(".")[0] || "website";
    } catch {
      return "website";
    }
  };

  // Validate URL - improved version
  const isValidUrl = (url: string): boolean => {
    try {
      // Add https:// prefix if missing for validation purposes
      let urlToValidate = url;
      if (
        !urlToValidate.startsWith("http://") &&
        !urlToValidate.startsWith("https://")
      ) {
        urlToValidate = "https://" + urlToValidate;
      }

      const urlObj = new URL(urlToValidate);

      return (
        urlObj.hostname.includes(".") &&
        // Check for TLD (Top Level Domain)
        /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i.test(
          urlObj.hostname
        )
      );
    } catch {
      return false;
    }
  };

  const handleAddSocialClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSocialInput(true);
  };

  const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewSocialData((prev) => ({
      ...prev,
      url: value,
      platform: value ? extractPlatformFromUrl(value) : prev.platform,
    }));

    // Clear error when input changes
    if (error) setError(null);
  };

  const handleSocialSave = () => {
    if (!newSocialData.url) {
      setError("URL is required");
      return;
    }

    if (!isValidUrl(newSocialData.url)) {
      setError("Please enter a valid URL");
      return;
    }

    // Ensure the URL has a proper protocol prefix when saving
    let finalUrl = newSocialData.url;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    const platform = newSocialData.platform || extractPlatformFromUrl(finalUrl);

    setSocials((prev) => ({
      ...prev,
      [platform.toLowerCase()]: finalUrl,
    }));

    resetSocialInput();
  };

  const resetSocialInput = () => {
    setNewSocialData({ platform: "", url: "" });
    setShowSocialInput(false);
    setError(null);
  };

  const handleDeleteSocial = (platform: string) => {
    setSocials((prev) => {
      const updated = { ...prev };
      delete updated[platform];
      return updated;
    });
  };

  // Handle clicks outside the social input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSocialInput &&
        socialInputRef.current &&
        !socialInputRef.current.contains(event.target as Node)
      ) {
        resetSocialInput();
      }
    };

    if (showSocialInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSocialInput]);

  return (
    <div className="flex flex-col items-center lg:items-end mt-4">
      <p className="text-sm dark:text-gray-300 text-gray-700 mb-2">Socials</p>
      <div className="flex flex-wrap gap-y-2 justify-center lg:justify-end space-x-2">
        {/* Add new social button */}
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-white dark:bg-slate-700"
          title="Add social media"
          onClick={handleAddSocialClick}
        >
          <Plus size={18} className="text-gray-700 dark:text-gray-200" />
        </Button>

        {/* Social media links */}
        {Object.entries(socials).map(([platform, url]) => (
          <div key={platform} className="relative group">
            <Link href={url || "#"} target="_blank" rel="noopener noreferrer">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full bg-white dark:bg-slate-700"
                title={platform.charAt(0).toUpperCase() + platform.slice(1)}
              >
                <SocialIcon
                  platform={platform}
                  size={18}
                  className="text-gray-700 dark:text-gray-200"
                />
              </Button>
            </Link>
            {/* Delete button */}
            <button
              type="button"
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteSocial(platform)}
              title="Delete social"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Social Input Form */}
      {showSocialInput && (
        <div
          ref={socialInputRef}
          className="mt-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md w-full lg:w-64 border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                URL
              </label>
              <input
                type="text"
                name="url"
                placeholder="https://"
                value={newSocialData.url}
                onChange={handleSocialInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  error
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white`}
              />
              {error && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-left">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSocialSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check size={16} className="mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaSection;
