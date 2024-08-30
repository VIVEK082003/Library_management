using LibraryManagementAPI.Models;
using Lms.Data.Repository;
using Microsoft.EntityFrameworkCore;

namespace Lms.Data.Repository
{
    public class GenreRepository : IGenreRepository
    {
        private readonly LmsContext dbContext;

        public GenreRepository(LmsContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public void Add(Genre genre)
        {
            dbContext.Set<Genre>().Add(genre);
        }

        public void SaveChanges()
        {
            dbContext.SaveChanges();
        }

        // Other methods if needed
    }
}