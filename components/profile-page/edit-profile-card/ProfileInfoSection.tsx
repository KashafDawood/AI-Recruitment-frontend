import React from "react";

type ProfileInfoSectionProps = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  suffix?: string;
  inputClassName?: string;
};

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  suffix = "",
  inputClassName = "",
}) => {
  return (
    <div>
      <p className="text-sm dark:text-gray-300 text-gray-700">{label}</p>
      <p className="font-semibold text-xl">
        <input
          name={name}
          className={`bg-transparent inline-block border-b-2 border-black dark:border-white outline-none ${inputClassName}`}
          type={type}
          value={value}
          onChange={onChange}
        />
        {suffix}
      </p>
    </div>
  );
};

export default ProfileInfoSection;
