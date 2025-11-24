using Microsoft.EntityFrameworkCore;
using TodoTimelineApi.Models;

namespace TodoTimelineApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TimelineEntry> TimelineEntries { get; set; }
        public DbSet<ApiConnection> ApiConnections { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ===============================
            // USER
            // ===============================
            modelBuilder.Entity<User>()
                .HasMany(u => u.TimelineEntries)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasMany(u => u.ApiConnections)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ===============================
            // TIMELINE ENTRY
            // ===============================
            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.Title)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.Description)
                .IsRequired(false);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.EntryType)
                .IsRequired(false)
                .HasMaxLength(50);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.Category)
                .IsRequired(false)
                .HasMaxLength(100);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.ImageUrl)
                .IsRequired(false);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.ExternalUrl)
                .IsRequired(false);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.SourceApi)
                .IsRequired(false);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.ExternalId)
                .IsRequired(false);

            modelBuilder.Entity<TimelineEntry>()
                .Property(t => t.Metadata)
                .IsRequired(false);

            // User navigation property is optional (we set UserId directly)
            modelBuilder.Entity<TimelineEntry>()
                .HasOne(t => t.User)
                .WithMany(u => u.TimelineEntries)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            // ===============================
            // API CONNECTION
            // ===============================
            modelBuilder.Entity<ApiConnection>()
                .Property(a => a.ApiProvider)
                .IsRequired();
        }
    }
}