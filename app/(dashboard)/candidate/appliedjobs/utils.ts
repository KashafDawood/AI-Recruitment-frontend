import type { JobStatus } from "@/types/job"

export const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "interviewing":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200"
    case "offered":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getStatusText = (status: JobStatus) => {
  switch (status) {
    case "applied":
      return "Applied"
    case "interviewing":
      return "Interviewing"
    case "rejected":
      return "Rejected"
    case "offered":
      return "Offered"
    default:
      return status
  }
}
