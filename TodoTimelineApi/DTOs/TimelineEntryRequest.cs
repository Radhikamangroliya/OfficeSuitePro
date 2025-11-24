using System.ComponentModel.DataAnnotations;

namespace TodoTimelineApi.DTOs;

public class TimelineEntryRequest
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    public DateTime? EventDate { get; set; }

    [StringLength(50)]
    public string? EntryType { get; set; }

    [StringLength(100)]
    public string? Category { get; set; }

    public string? ImageUrl { get; set; }
    public string? ExternalUrl { get; set; }
    public string? SourceApi { get; set; }
    public string? ExternalId { get; set; }
    public string? Metadata { get; set; }
    public string? User { get; set; } // User email or ID
}