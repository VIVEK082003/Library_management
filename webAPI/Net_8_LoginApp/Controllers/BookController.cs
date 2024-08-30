using LibraryManagementAPI.Models;
using Lms.Services.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly ILogger<BookController> _logger;

        public BookController(IBookService bookService, ILogger<BookController> logger)
        {
            _bookService = bookService;
            _logger = logger;
        }

        // GET: api/Book/GetAllBooks
        [HttpGet]
        [Route("GetAllBooks")]
        public ActionResult<IEnumerable<BookDTO>> GetAllBooks()
        {
            var books = _bookService.GetAllBooks();
            return Ok(books);
        }

        // POST: api/Book/AddBook
        [HttpPost]
        [Route("AddBook")]
        public ActionResult<BookDTO> AddBook([FromBody] BookDTO newBook)
        {
            if (newBook == null)
            {
                return BadRequest("Book data is null.");
            }

            try
            {
                var addedBook = _bookService.AddBook(newBook);
                return CreatedAtAction(nameof(GetAllBooks), new { id = addedBook.BookId }, addedBook);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest($"ArgumentNullException: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Internal server error: {ex.Message}");
            }
        }


        // New endpoint to delete a user
        [HttpDelete]
        [Route("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            try
            {
                var isDeleted = _bookService.DeleteBook(bookId);
                if (!isDeleted)
                {
                    return NotFound($"User with ID {bookId} not found");
                }

                return Ok($"User with ID {bookId} has been deleted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting user");
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPut]
        [Route("EditBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] BookDTO updatedBook)
        {
            var result = _bookService.UpdateBook(bookId, updatedBook);

            if (result == null)
            {
                return NotFound(); // Or handle accordingly
            }

            return Ok(result);
        }
    }
}

