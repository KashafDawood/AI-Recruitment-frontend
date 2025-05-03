import type { JobStatus } from "@/types/job"

export const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "applied":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
    case "interviewing":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700"
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
    case "offered":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
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
