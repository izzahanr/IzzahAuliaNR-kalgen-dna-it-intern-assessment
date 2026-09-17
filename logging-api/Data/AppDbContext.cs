using LoggingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LoggingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<LogEntry> Logs { get; set; }
    }
}
