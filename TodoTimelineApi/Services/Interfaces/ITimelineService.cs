using TodoTimelineApi.Models;

namespace TodoTimelineApi.Services.Interfaces
{
    public interface ITimelineService
    {
        Task<List<TimelineEntry>> GetUserTimelineAsync(int userId);
        Task<TimelineEntry?> GetEntryByIdAsync(int id, int userId);
        Task<TimelineEntry> CreateEntryAsync(TimelineEntry entry);
        Task<TimelineEntry?> UpdateEntryAsync(int id, TimelineEntry updated, int userId);
        Task<bool> DeleteEntryAsync(int id, int userId);
    }
}