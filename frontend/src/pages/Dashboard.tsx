import GithubWidget from "../components/github/GithubWidget";

export default function Dashboard() {
  return (
    <div className="px-8 py-6">

      {/* ---------------------- PAGE HEADER ----------------------- */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Timeline</h1>
        <p className="text-gray-600">Track your work, activities, and memories</p>
      </div>

      {/* ---------------------- TOP STATS GRID ----------------------- */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        {/* Existing Stats Cards */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Productive Hours</p>
          <h2 className="text-2xl font-bold mt-1">2.0h</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Coding Days</p>
          <h2 className="text-2xl font-bold mt-1">0</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Collaboration Events</p>
          <h2 className="text-2xl font-bold mt-1">0</h2>
        </div>

        {/* ⭐ GITHUB WIDGET CARD ADDED HERE ⭐ */}
        <div className="bg-white p-4 rounded-xl shadow-sm col-span-1">
          <GithubWidget />
        </div>
      </div>

      {/* ---------------------- MAIN BODY LAYOUT ----------------------- */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT SIDEBAR: Assigned Tasks */}
        <div className="col-span-3 bg-white rounded-xl p-4 shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-3">Assigned Tasks</h3>
          {/* your existing content */}
        </div>

        {/* CENTER: Timeline Entries */}
        <div className="col-span-6">
          {/* timeline entries, search, filters etc */}
        </div>

        {/* RIGHT SIDEBAR: Today's Activity */}
        <div className="col-span-3 bg-white p-4 rounded-xl shadow-sm h-fit">
          <h3 className="text-lg font-semibold mb-3">Today's Activity</h3>
          {/* your existing content */}
        </div>

      </div>

      {/* ---------------------- TEAM ACTIVITY SECTION ----------------------- */}
      <div className="mt-10 bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Team Activity</h3>
        {/* your existing content */}
      </div>

    </div>
  );
}