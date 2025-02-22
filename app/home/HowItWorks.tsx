import { UserPlus, FileText, Briefcase } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="w-10 h-10 text-yellow-400" />,
      title: "Create Account",
      description: "Easily sign up to get started on your journey.",
    },
    {
      icon: <FileText className="w-10 h-10 text-yellow-400" />,
      title: "Complete Your Profile",
      description: "Fill in your details to get noticed by recruiters.",
    },
    {
      icon: <Briefcase className="w-10 h-10 text-yellow-400" />,
      title: "Apply for Jobs or Hire",
      description: "Find the best opportunities or hire top talent.",
    },
  ];

  return (
    <div className="bg-gray-900 text-white p-10 rounded-xl shadow-lg max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">How It Works?</h2>
      <div className="flex justify-between items-center space-x-6">
        {steps.map((step, index) => (
          <div key={index} className="text-center flex flex-col items-center">
            <div className="bg-gray-800 p-4 rounded-full">{step.icon}</div>
            <h3 className="text-lg font-semibold mt-3">{step.title}</h3>
            <p className="text-sm text-gray-300 mt-1">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
