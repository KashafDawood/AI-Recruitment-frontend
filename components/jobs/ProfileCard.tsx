import Link from "next/link";
import OptimizeImage from "../custom/optimizeImage";
import { ExternalLink, MapPin, Building } from "lucide-react";
import { Employer } from "@/types/job";

interface ProfileCardProps {
  employer: Employer;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ employer }) => {
  const about = employer.about_company.slice(0, 100);

  return (
    <Link href={`/${employer.username}`} className="block w-full group">
      <div className="flex flex-col md:flex-row md:items-start gap-4 p-5 bg-white dark:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 w-full">
        {/* Profile Image with status indicator */}
        <div className="relative w-20 h-20 mx-auto md:mx-0 flex-shrink-0">
          <OptimizeImage
            src={employer.photo}
            alt={employer.name}
            width={300}
            className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/20 transition-all duration-300"
          />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-700 rounded-full"></div>
        </div>

        {/* Employer Info with enhanced layout */}
        <div className="flex flex-col text-center md:text-left flex-grow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {employer.name
                  ? employer.name.charAt(0).toUpperCase() +
                    employer.name.slice(1)
                  : "Unknown"}
              </h3>

              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-gray-500 dark:text-gray-300 mb-2">
                <Building className="h-3 w-3 text-gray-400" />
                <span className="font-medium">
                  {employer.company_name || "Company not listed"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-1 text-xs text-blue-600 dark:text-blue-400 mt-2 md:mt-0">
              <span>View profile</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
            {employer.address && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span>{employer.address}</span>
              </div>
            )}
          </div>

          {employer.about_company && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 hidden md:block">
              {about}...
            </p>
          )}

          {/* Company badges/tags */}
          {employer.industry && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] rounded-full border border-blue-100 dark:border-blue-800">
                {employer.industry}
              </span>
              {employer.company_size && (
                <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-[10px] rounded-full border border-green-100 dark:border-green-800">
                  Company Size: {employer.company_size}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
