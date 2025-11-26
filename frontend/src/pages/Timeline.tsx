import { useState } from "react";
import { TimelineHeader } from "../components/timeline/TimelineHeader";
import { TimelineStats } from "../components/timeline/TimelineStats";
import { TimelineList } from "../components/timeline/TimelineList";
import { TimelineCreateModal } from "../components/timeline/TimelineCreateModal";
import { TimelineFilters } from "../components/timeline/TimelineFilters";
import { ViewToggle } from "../components/timeline/ViewToggle";
import { QuickActions } from "../components/timeline/QuickActions";
import { ActivitySummary } from "../components/timeline/ActivitySummary";
import { TodaysActivity } from "../components/timeline/TodaysActivity";
import { TeamActivity } from "../components/timeline/TeamActivity";
import { TimelineCalendarView } from "../components/timeline/TimelineCalendarView";

export default function Timeline() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Page Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-800 to-gray-600 rounded-full"></div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                My Timeline
              </h1>
              <p className="text-gray-600 text-lg font-medium">Your personal activity log and memories</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <QuickActions />
              <ViewToggle view={view} onViewChange={setView} />
              <TimelineCreateModal />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <TimelineStats />

        {/* Activity Summary */}
        <ActivitySummary />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Timeline Content */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <TimelineFilters />

            {/* Timeline List or Calendar */}
            {view === "list" ? <TimelineList /> : <TimelineCalendarView />}
          </div>

          {/* Right Column - Today's Activity & Team Activity */}
          <div className="lg:col-span-1 space-y-6">
            <TodaysActivity />
            <TeamActivity />
          </div>
        </div>
      </div>
    </div>
  );
}