using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoTimelineApi.Models;
using TodoTimelineApi.Services.Interfaces;
using TodoTimelineApi.DTOs;
using System.Linq;

namespace TodoTimelineApi.Controllers
{
    [ApiController]
    [Route("api/timeline")]
    [Authorize]
    public class TimelineController : ControllerBase
    {
        private readonly ITimelineService _timelineService;

        public TimelineController(ITimelineService timelineService)
        {
            _timelineService = timelineService;
        }

        private int GetUserId()
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == "id");
            return int.Parse(idClaim!.Value);
        }

        // =============================================
        // GET: /api/timeline
        // =============================================
        [HttpGet]
        public async Task<IActionResult> GetTimeline()
        {
            var userId = GetUserId();
            Console.WriteLine($"GetTimeline called for UserId: {userId}");
            var entries = await _timelineService.GetUserTimelineAsync(userId);
            Console.WriteLine($"Returning {entries.Count} entries for UserId: {userId}");
            if (entries.Count > 0)
            {
                Console.WriteLine($"First entry: Id={entries[0].Id}, Title={entries[0].Title}, UserId={entries[0].UserId}");
            }
            else
            {
                Console.WriteLine($"No entries found for UserId: {userId}. Check if entries exist with this UserId in database.");
            }
            return Ok(entries);
        }

        // =============================================
        // POST: /api/timeline
        // =============================================
        [HttpPost]
        public async Task<IActionResult> CreateEntry([FromBody] TimelineEntryRequest request)
        {
            try
            {
                Console.WriteLine("=== CreateEntry called ===");
                Console.WriteLine($"ModelState.IsValid: {ModelState.IsValid}");
                
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .SelectMany(x => x.Value!.Errors.Select(e => $"{x.Key}: {e.ErrorMessage}"));
                    var errorDetails = string.Join(", ", errors);
                    Console.WriteLine($"ModelState validation failed: {errorDetails}");
                    return BadRequest(new { error = "Validation failed", details = errorDetails });
                }
                
                Console.WriteLine($"Request received: {request?.Title ?? "null"}");
                
                if (request == null)
                {
                    Console.WriteLine("Request is null");
                    return BadRequest(new { error = "Entry data is required" });
                }

                if (string.IsNullOrWhiteSpace(request.Title))
                {
                    Console.WriteLine("Title is empty");
                    return BadRequest(new { error = "Title is required" });
                }

                var userId = GetUserId();
                Console.WriteLine($"UserId: {userId}");

                // Parse EventDate
                DateTime eventDate = DateTime.UtcNow;
                if (request.EventDate.HasValue)
                {
                    eventDate = request.EventDate.Value;
                }
                
                Console.WriteLine($"EventDate: {eventDate}");

                // Create a new entry with all required fields
                var newEntry = new TimelineEntry
                {
                    Title = request.Title.Trim(),
                    Description = request.Description ?? string.Empty,
                    Category = request.Category ?? string.Empty,
                    ImageUrl = request.ImageUrl ?? string.Empty,
                    ExternalUrl = request.ExternalUrl ?? string.Empty,
                    EntryType = !string.IsNullOrWhiteSpace(request.EntryType) ? request.EntryType.Trim() : "Activity",
                    SourceApi = !string.IsNullOrWhiteSpace(request.SourceApi) ? request.SourceApi.Trim() : "manual",
                    ExternalId = request.ExternalId ?? string.Empty,
                    Metadata = request.Metadata ?? string.Empty,
                    EventDate = eventDate,
                    UserId = userId
                };

                Console.WriteLine($"Creating entry with Title: {newEntry.Title}, EventDate: {newEntry.EventDate}");

                var created = await _timelineService.CreateEntryAsync(newEntry);
                Console.WriteLine($"Entry created successfully with ID: {created.Id}");
                
                return Ok(created);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating entry: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to create entry", details = ex.Message });
            }
        }

        // =============================================
        // PUT: /api/timeline/{id}
        // =============================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEntry(int id, [FromBody] TimelineEntryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState
                        .Where(x => x.Value?.Errors.Count > 0)
                        .SelectMany(x => x.Value!.Errors.Select(e => $"{x.Key}: {e.ErrorMessage}"));
                    return BadRequest(new { error = "Validation failed", details = string.Join(", ", errors) });
                }

                if (request == null)
                {
                    return BadRequest(new { error = "Entry data is required" });
                }

                var userId = GetUserId();
                Console.WriteLine($"UpdateEntry called for EntryId: {id}, UserId: {userId}");

                var updated = await _timelineService.UpdateEntryAsync(id, request, userId);
                if (updated == null)
                {
                    Console.WriteLine($"Entry {id} not found or doesn't belong to user {userId}");
                    return NotFound(new { error = "Entry not found or you don't have permission to update it" });
                }

                Console.WriteLine($"Entry {id} updated successfully");
                return Ok(updated);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating entry: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { error = "Failed to update entry", details = ex.Message });
            }
        }

        // =============================================
        // DELETE: /api/timeline/{id}
        // =============================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntry(int id)
        {
            var userId = GetUserId();

            var deleted = await _timelineService.DeleteEntryAsync(id, userId);
            if (!deleted) return NotFound();

            return NoContent();
        }
    }
}