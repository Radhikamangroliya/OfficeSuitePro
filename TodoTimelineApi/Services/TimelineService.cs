using Microsoft.EntityFrameworkCore;
using TodoTimelineApi.Data;
using TodoTimelineApi.Models;
using TodoTimelineApi.Services.Interfaces;

namespace TodoTimelineApi.Services
{
    public class TimelineService : ITimelineService
    {
        private readonly AppDbContext _db;

        public TimelineService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<TimelineEntry>> GetUserTimelineAsync(int userId)
        {
            return await _db.TimelineEntries
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.EventDate)
                .ToListAsync();
        }

        public async Task<TimelineEntry?> GetEntryByIdAsync(int id, int userId)
        {
            return await _db.TimelineEntries
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        }

        public async Task<TimelineEntry> CreateEntryAsync(TimelineEntry entry)
        {
            entry.CreatedAt = DateTime.UtcNow;
            entry.UpdatedAt = DateTime.UtcNow;

            _db.TimelineEntries.Add(entry);
            await _db.SaveChangesAsync();
            return entry;
        }

        public async Task<TimelineEntry?> UpdateEntryAsync(int id, TimelineEntry updated, int userId)
        {
            var existing = await GetEntryByIdAsync(id, userId);
            if (existing == null) return null;

            existing.Title = updated.Title ?? existing.Title;
            existing.Description = updated.Description ?? existing.Description;
            existing.EventDate = updated.EventDate;
            existing.EntryType = updated.EntryType ?? existing.EntryType;
            existing.Category = updated.Category ?? existing.Category;
            existing.ImageUrl = updated.ImageUrl ?? existing.ImageUrl;
            existing.ExternalUrl = updated.ExternalUrl ?? existing.ExternalUrl;
            existing.Metadata = updated.Metadata ?? existing.Metadata;
            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteEntryAsync(int id, int userId)
        {
            var entry = await GetEntryByIdAsync(id, userId);
            if (entry == null) return false;

            _db.TimelineEntries.Remove(entry);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}