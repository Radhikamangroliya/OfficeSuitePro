namespace TodoTimelineApi.DTOs;

public class TimelineEntryResponse
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime EventDate { get; set; }

    public string EntryType { get; set; } = string.Empty;
    public string? Category { get; set; }

    public string? ImageUrl { get; set; }
    public string? ExternalUrl { get; set; }
    public string? SourceApi { get; set; }
    public string? ExternalId { get; set; }
    public string? Metadata { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}