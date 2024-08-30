using Lms.Services.Repository;
using LibraryManagementAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class RequestBookService : IRequestBookService
{
    private readonly LmsContext _context;

    public RequestBookService(LmsContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RequestBook>> GetAllRequestsAsync()
    {
        return await _context.RequestBooks
            .Include(rb => rb.Book)
            .ToListAsync();
    }

    public async Task<RequestBook> CreateRequestAsync(string userName, string bookName, DateTime dateIssued, DateTime? dateReturn)
    {
        var book = await _context.Books.FirstOrDefaultAsync(b => b.BookName == bookName && b.Quantity > 0);
        if (book == null) return null;

        var requestBook = new RequestBook
        {
            UserName = userName,
            BookId = book.BookId,
            BookName = bookName,
            DateIssued = dateIssued,
            DateReturn = dateReturn,
            Status = RequestStatus.Processing
        };

        _context.RequestBooks.Add(requestBook);
        await _context.SaveChangesAsync();

        return requestBook;
    }

    public async Task ApproveRequestAsync(int requestId)
    {
        var request = await _context.RequestBooks
            .Include(rb => rb.Book)
            .FirstOrDefaultAsync(rb => rb.RequestBookId == requestId);
        if (request == null) return;

        var book = request.Book;
        if (book.Quantity > 0)
        {
            book.Quantity -= 1;
            request.Status = RequestStatus.Accepted;
            _context.Books.Update(book);
            _context.RequestBooks.Update(request);
            await _context.SaveChangesAsync();
        }
    }

    public async Task RejectRequestAsync(int requestId)
    {
        var request = await _context.RequestBooks.FirstOrDefaultAsync(rb => rb.RequestBookId == requestId);
        if (request == null) return;

        request.Status = RequestStatus.Rejected;
        _context.RequestBooks.Update(request);
        await _context.SaveChangesAsync();
    }
    public async Task<RequestBook> DeleteRequestAsync(int requestId)
    {
        var request = await _context.RequestBooks.FindAsync(requestId);
        if (request == null)
        {
            return null; // Request not found
        }

        _context.RequestBooks.Remove(request);
        await _context.SaveChangesAsync();

        return request; // Return the deleted request if needed
    }
    public async Task<IEnumerable<RequestBook>> GetApprovedBooksByDateAsync(DateTime fromDate, DateTime toDate)
    {
        return await _context.RequestBooks
            .Where(rb => rb.Status == RequestStatus.Accepted && rb.DateIssued >= fromDate && rb.DateIssued <= toDate)
            .Include(rb => rb.Book)
            .ToListAsync();
    }


    public async Task<IEnumerable<Book>> GetAvailableBooksAsync()
    {
        return await _context.Books.Where(b => b.Quantity > 0).ToListAsync();
    }
}
