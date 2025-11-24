using System.Collections.Generic;

namespace TodoTimelineApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string OAuthProvider { get; set; }
        public string OAuthId { get; set; }
        public string Email { get; set; }
        public string DisplayName { get; set; }
        public string ProfileImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastLoginAt { get; set; }

        public ICollection<TimelineEntry> TimelineEntries { get; set; }
        public ICollection<ApiConnection> ApiConnections { get; set; }
    }
}