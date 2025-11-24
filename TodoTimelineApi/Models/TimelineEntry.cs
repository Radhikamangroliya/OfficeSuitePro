namespace TodoTimelineApi.Models
{
    public class TimelineEntry
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }

        public string EntryType { get; set; }   // Achievement, Activity, Milestone, Memory
        public string Category { get; set; }

        public string ImageUrl { get; set; }
        public string ExternalUrl { get; set; }

        public string SourceApi { get; set; }   // manual, github, spotify
        public string ExternalId { get; set; }

        public string Metadata { get; set; }    // JSON data

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public User User { get; set; }
    }
}