using AutoMapper;
using LibraryManagementAPI.Models;
using Lms.Services.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

public class BookService : IBookService
{
    private readonly LmsContext dbcontext;
    private readonly IMapper _mapper;
    private readonly ILogger<BookService> _logger;

    public BookService(LmsContext dbcontext, IMapper mapper, ILogger<BookService> logger)
    {
        this.dbcontext = dbcontext;
        _mapper = mapper;
        _logger = logger;
    }

    public IEnumerable<BookDTO> GetAllBooks()
    {
        var books = dbcontext.Books
            .Select(book => new BookDTO
            {
                BookId = book.BookId,
                BookName = book.BookName,
                Author = book.Author,
                DatePublished = book.DatePublished,
                GenreType = book.Genre.GenreType,
                Quantity = book.Quantity
            })
            .ToList();

        return books;
    }
    /* public BookDTO UpdateBook(int bookId, BookDTO updatedBook)
     {
         var book = dbcontext.Books.FirstOrDefault(u => u.BookId == bookId);

         if (book == null)
         {
             return null; // Or throw an exception or handle accordingly
         }

         // Update user properties
         book.BookName = updatedBook.BookName;
         book.Author = updatedBook.Author;
         book.DatePublished = updatedBook.DatePublished;
         book.GenreType = updatedBook.Genre.GenreType;
         book.Quantity = updatedBook.Quantity;

         book.GenreId = existingGenre.GenreId;
         dbcontext.SaveChanges();

         return new BookDTO
         {
             BookId = book.BookId,
             BookName = book.BookName,
             Author = updatedBook.Author,
             DatePublished = updatedBook.DatePublished,
             GenreType = updatedBook.Genre.GenreType,
             Quantity = updatedBook.Quantity
         };
     }*/
    public BookDTO UpdateBook(int bookId, BookDTO updatedBook)
    {
        var book = dbcontext.Books.Include(b => b.Genre).FirstOrDefault(u => u.BookId == bookId);

        if (book == null)
        {
            return null; // Or throw an exception or handle accordingly
        }

        // Update book properties
        book.BookName = updatedBook.BookName;
        book.Author = updatedBook.Author;
        book.DatePublished = updatedBook.DatePublished;
        book.Quantity = updatedBook.Quantity;

        // Check if the genre exists
        var existingGenre = dbcontext.Genres.FirstOrDefault(g => g.GenreType == updatedBook.GenreType);
        if (existingGenre == null)
        {
            // If the genre doesn't exist, add it
            existingGenre = new Genre
            {
                GenreType = updatedBook.GenreType
            };
            dbcontext.Genres.Add(existingGenre);
            dbcontext.SaveChanges(); // Save changes to get the GenreId
        }

        // Update the GenreId of the book
        book.GenreId = existingGenre.GenreId;

        dbcontext.SaveChanges();

        // Return the updated book DTO
        return new BookDTO
        {
            BookId = book.BookId,
            BookName = book.BookName,
            Author = book.Author,
            DatePublished = book.DatePublished,
            GenreType = updatedBook.GenreType,
            Quantity = book.Quantity
        };
    }
    public bool DeleteBook(int bookId)
    {
        var bookToDelete = dbcontext.Books.FirstOrDefault(b => b.BookId == bookId);

        if (bookToDelete == null)
        {
            // Book not found
            return false;
        }

        dbcontext.Books.Remove(bookToDelete);
        dbcontext.SaveChanges();

        return true;
    }

    public BookDTO AddBook(BookDTO newBook)
    {
        if (newBook == null)
        {
            throw new ArgumentNullException(nameof(newBook));
        }

        // Check if the genre exists
        var existingGenre = dbcontext.Genres.FirstOrDefault(g => g.GenreType == newBook.GenreType);
        if (existingGenre == null)
        {
            // If the genre doesn't exist, add it
            existingGenre = new Genre
            {
                GenreType = newBook.GenreType
            };
            dbcontext.Genres.Add(existingGenre);
            dbcontext.SaveChanges(); // Save changes to get the GenreId
        }

        // Map the BookDTO to Book entity
        var bookEntity = _mapper.Map<Book>(newBook);
        bookEntity.GenreId = existingGenre.GenreId; // Assign the GenreId to the book

        // Add the book to the context and save changes
        dbcontext.Books.Add(bookEntity);
        dbcontext.SaveChanges();

        // Map the Book entity back to BookDTO and return
        return _mapper.Map<BookDTO>(bookEntity);
    }

}

// Implement other methods like UpdateBook, DeleteBook, etc.

