namespace TodoTimelineApi.Services.Interfaces
{
    public interface IGoogleCalendarService
    {
        Task<object?> GetUpcomingEventsAsync(string accessToken);
        Task<object?> GetEventsForDateAsync(string accessToken, DateTime date);
    }
}
