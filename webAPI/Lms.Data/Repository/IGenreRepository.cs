namespace Lms.Data.Repository
{
    internal interface IGenreRepository
    {
        void Add(Genre genre);
        void SaveChanges();
        // Other methods if needed
    }
}
