import Link from "next/link";
import { Employer } from "@/types/job";
import OptimizeImage from "../custom/optimizeImage";

interface ProfileCardProps {
  employer: Employer;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ employer }) => {
  return (
    <Link href={`/${employer.username}`}>
      <div className="flex items-center gap-4 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition duration-200 w-full dark:bg-[#232222]">
        {/* Profile Image */}
        <div className="w-16 h-16 flex-shrink-0">
          <OptimizeImage
            src={employer.photo}
            alt={employer.name}
            width={300}
            className="w-full h-full rounded-full object-cover border border-gray-300 dark:border-gray-800"
          />
        </div>

        {/* Employer Info */}
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-sm dark:text-white">
            {employer.name
              ? employer.name.charAt(0).toUpperCase() + employer.name.slice(1)
              : "Unknown"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-200">
            {employer.company_name || "Company not listed"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;
