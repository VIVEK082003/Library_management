using LibraryManagementAPI.Models;
using System.Collections.Generic;

namespace Lms.Services.Repository
{
    public interface IBookService
    {
        IEnumerable<BookDTO> GetAllBooks();
        BookDTO AddBook(BookDTO newBook);
        bool DeleteBook(int bookId);
        BookDTO UpdateBook(int bookId, BookDTO updatedBook);
    }
}
