using Microsoft.AspNetCore.Mvc;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Controllers
{
    [ApiController]
    [Route("api/google-calendar")]
    public class GoogleCalendarController : ControllerBase
    {
        private readonly IGoogleCalendarService _googleCalendar;

        public GoogleCalendarController(IGoogleCalendarService googleCalendar)
        {
            _googleCalendar = googleCalendar;
        }

        // ---- GET ALL UPCOMING EVENTS ----
        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcoming([FromQuery] string accessToken)
        {
            var events = await _googleCalendar.GetUpcomingEventsAsync(accessToken);
            return Ok(events);
        }

        // ---- GET EVENTS FOR A SELECTED DATE ----
        [HttpGet("day")]
        public async Task<IActionResult> GetEventsForDay([FromQuery] string accessToken, [FromQuery] DateTime date)
        {
            var events = await _googleCalendar.GetEventsForDateAsync(accessToken, date);
            return Ok(events);
        }
    }
}
