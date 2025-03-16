"use client"

import { getAllJobs } from "@/api/candidate/getAllJobs"
import { useEffect, useState } from "react"
import { FilterIcon, X, ChevronDown, BookmarkIcon, Share2Icon, Briefcase, MapPin, User, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Job {
  title: string
  status: string
  salary?: string
  location: string
  company: string
  description: string
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  return truncated.substring(0, truncated.lastIndexOf(" ")) + "..."
}

export default function FindJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>(["Designer", "Full Time", "Samsung"])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getAllJobs()
        jobs.reverse()
        setJobs(jobs)
        if (jobs.length > 0) {
          setSelectedJob(jobs[1]) // Select the second job by default (Product Designer)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchJobs()
  }, [])

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
  }

  return (
    <div className="container mx-auto p-4">

      <div className="flex gap-6">
        {/* Left column - Job listings */}
        <div className="w-full lg:w-3/5 space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-grow">
              <Input type="text" placeholder="Search job" className="w-full pl-4 pr-10 py-2 rounded-lg border" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                  {filter}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeFilter(filter)} />
                </Badge>
              ))}
              <button onClick={clearAllFilters} className="text-blue-600 text-sm font-medium ml-2">
                Clear All
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-4">12 Job Active</div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <button className="text-sm font-medium flex items-center">
                Popular Jobs <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

          {jobs.map((job, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedJob?.title === job.title ? "border-purple-500 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex gap-3">
                <div className="flex-grow">
                  <div className="flex justify-between gap-2">
                    <div className="flex gap-2">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${index % 3 === 0 ? "bg-green-500" : index % 3 === 1 ? "bg-purple-600" : "bg-orange-500"}`}
                          >
                            {job.title.substring(0, 1)}
                        </div>
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 my-2">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full text-xs px-2">
                            UX/UI Design
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full text-xs px-2">
                            Design Thinking
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full text-xs px-2">
                            Figma
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 rounded-full text-xs px-2">
                            +4
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="icon" className="rounded-lg h-10 w-10">
                      <BookmarkIcon className="h-5 w-5 text-blue-600" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-6 mt-3">
                    The {job.title} is responsible for articulating and conceptualizing the product vision and to shape
                    our features from start to finish.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-gray-50 border-0 text-xs px-2 py-0 gap-1">
                        <Briefcase className="h-5 w-5 text-gray-500" />      
                        Full Time
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-gray-50 border-0 text-xs px-2 py-0 gap-1">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        Samsung
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="text-xs">{index === 0 ? "74" : index === 1 ? "50" : "48"} applied</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span className="text-xs">{index === 0 ? "3" : index === 1 ? "5" : "12"} days left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column - Job details */}
        {selectedJob && (
          <div className="hidden lg:block lg:w-2/5 border rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Product Designer</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>Pickalab</span>
                  <span>•</span>
                  <span>Samsung, KR</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-lg h-10 w-10">
                  <BookmarkIcon className="h-5 w-5 text-blue-600" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-lg h-10 w-10">
                  <Share2Icon className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Applicants Summary</h3>
                <Badge className="bg-green-100 text-green-800 font-medium">New</Badge>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">67</span>
                    <span className="text-sm text-gray-500">/100</span>
                  </div>
                  {/* This would be a pie chart in a real implementation */}
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e0e0e0" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#4f46e5"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="75"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="200"
                      strokeDashoffset="175"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="12"
                      strokeDasharray="251.2"
                      strokeDashoffset="240"
                    />
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm">New Applicants</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                    <span className="text-sm">Approved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm">Rejected</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Job Type</div>
                <div className="font-medium">Full Time</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Experience</div>
                <div className="font-medium">Min. 1 Year</div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500 mb-1">Salary</div>
                <div className="font-medium">$200</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-3">About Job Role</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The Product Designer is responsible for articulating and conceptualizing our product vision and to shape
                our features from start to finish. You will not only be improving the user experience as it exists but
                also drive business vision.
                <a href="#" className="text-blue-600 font-medium ml-1">
                  View Detail Job
                </a>
              </p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">Apply Job</Button>
          </div>
        )}
      </div>
    </div>
  )
}

