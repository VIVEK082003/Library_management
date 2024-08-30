using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace LibraryManagementAPI.Models
{
    public class LmsContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public LmsContext(DbContextOptions<LmsContext> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<RequestBook> RequestBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Genre>(entity =>
            {
                entity.HasKey(e => e.GenreId);
                entity.Property(e => e.GenreType).IsRequired();
            });

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(e => e.BookId);
                entity.Property(e => e.BookName).IsRequired();
                entity.Property(e => e.Author).IsRequired();
                entity.Property(e => e.DatePublished).IsRequired();
                entity.Property(e => e.Quantity).IsRequired();

                entity.HasOne(b => b.Genre)
                      .WithMany(g => g.Books)
                      .HasForeignKey(b => b.GenreId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                var connectionString = _configuration.GetConnectionString("DBCS");
                optionsBuilder.UseSqlServer(connectionString, b => b.MigrationsAssembly("Library-ManagementAPI"));
            }
        }
    }
}
