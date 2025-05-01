import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, CheckCircle2, Clock } from "lucide-react"

export function JobStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-blue-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-blue-500/5 dark:from-gray-900 dark:to-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">24</div>
          <p className="text-xs text-muted-foreground">+4 from last month</p>
        </CardContent>
      </Card>

      <Card className="border-blue-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-blue-500/5 dark:from-gray-900 dark:to-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">7</div>
          <p className="text-xs text-muted-foreground">3 scheduled this week</p>
        </CardContent>
      </Card>

      <Card className="border-green-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-green-500/5 dark:from-gray-900 dark:to-green-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">2</div>
          <p className="text-xs text-muted-foreground">1 pending decision</p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/10 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-white to-amber-500/5 dark:from-gray-900 dark:to-amber-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-500">5.2 days</div>
          <p className="text-xs text-muted-foreground">-1.3 days from previous</p>
        </CardContent>
      </Card>
    </div>
  )
}
