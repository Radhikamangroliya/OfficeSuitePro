import GoogleCalendarView from "../components/GoogleCalendarView";

const CalendarPage: React.FC = () => {
  const accessToken = localStorage.getItem("google_access_token");

  console.log("Google Access Token:", accessToken);  // 👈 ADD THIS LINE

  return (
    <div style={{ padding: "25px" }}>
      <GoogleCalendarView accessToken={accessToken || ""} />
    </div>
  );
};

export default CalendarPage;
