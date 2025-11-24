using System.Net.Http.Headers;
using System.Text.Json;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Services
{
    public class GoogleCalendarService : IGoogleCalendarService
    {
        private readonly HttpClient _http;

        public GoogleCalendarService()
        {
            _http = new HttpClient();
        }

        // ----------- FETCH UPCOMING EVENTS -------------
        public async Task<object?> GetUpcomingEventsAsync(string accessToken)
        {
            var url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=20&orderBy=startTime&singleEvents=true";

            var req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _http.SendAsync(req);
            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<object>(json);
        }

        // ----------- FETCH EVENTS FOR SPECIFIC DAY -------------
        public async Task<object?> GetEventsForDateAsync(string accessToken, DateTime date)
        {
            string iso = date.ToString("yyyy-MM-dd");

            var url =
                $"https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&timeMin={iso}T00:00:00Z&timeMax={iso}T23:59:59Z";

            var req = new HttpRequestMessage(HttpMethod.Get, url);
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _http.SendAsync(req);
            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<object>(json);
        }
    }
}
