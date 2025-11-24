namespace TodoTimelineApi.Models
{
    public class ApiConnection
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        public string ApiProvider { get; set; }        // GitHub, Spotify
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        public DateTime TokenExpiresAt { get; set; }
        public DateTime LastSyncAt { get; set; }

        public bool IsActive { get; set; }

        public string Settings { get; set; }           // JSON config

        public User User { get; set; }
    }
}