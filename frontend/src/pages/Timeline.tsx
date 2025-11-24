import { useState } from "react";
import { TimelineHeader } from "../components/timeline/TimelineHeader";
import { TimelineStats } from "../components/timeline/TimelineStats";
import { TimelineList } from "../components/timeline/TimelineList";
import { TimelineCreateModal } from "../components/timeline/TimelineCreateModal";
import { TimelineFilters } from "../components/timeline/TimelineFilters";
import { ViewToggle } from "../components/timeline/ViewToggle";
import { QuickActions } from "../components/timeline/QuickActions";
import { ActivitySummary } from "../components/timeline/ActivitySummary";
import { AssignedTasks } from "../components/timeline/AssignedTasks";
import { TodaysActivity } from "../components/timeline/TodaysActivity";
import { TeamMembers } from "../components/timeline/TeamMembers";
import { TeamActivity } from "../components/timeline/TeamActivity";

export default function Timeline() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="min-h-screen bg-gray-50">
      <TimelineHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline</h1>
            <p className="text-gray-600">
              Track your work, activities, and memories
            </p>
          </div>
          <div className="flex items-center gap-3">
            <QuickActions />
            <ViewToggle view={view} onViewChange={setView} />
            <TimelineCreateModal />
          </div>
        </div>

        {/* Stats Row */}
        <TimelineStats />

        {/* Activity Summary */}
        <ActivitySummary />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
          {/* Left Column - Assigned Tasks & Team Members */}
          <div className="lg:col-span-1 space-y-6">
            <AssignedTasks />
            <TeamMembers />
          </div>

          {/* Middle Column - Timeline Content */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <TimelineFilters />

            {/* Timeline List */}
            {view === "list" ? <TimelineList /> : (
              <div className="text-center py-12 text-gray-500">
                Calendar view coming soon...
              </div>
            )}
          </div>

          {/* Right Column - Today's Activity & Team Activity */}
          <div className="lg:col-span-1 space-y-6">
            <TodaysActivity />
            <TeamActivity />
          </div>
        </div>
      </main>
    </div>
  );
}