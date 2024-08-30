using System.Collections.Generic;

namespace Lms.Services.Repository
{
    public interface IGenreService
    {
        IEnumerable<GenreDTO> GetAllGenres();
        GenreDTO AddGenre(GenreDTO newGenre);
        bool DeleteGenre(int genreId);
        GenreDTO UpdateGenre(int genreId, GenreDTO updatedGenre);
    }
}
