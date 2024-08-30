using Lms.Services.Repository;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class RequestBookController : ControllerBase
{
    private readonly IRequestBookService _requestBookService;

    public RequestBookController(IRequestBookService requestBookService)
    {
        _requestBookService = requestBookService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RequestBook>>> GetRequests()
    {
        var requests = await _requestBookService.GetAllRequestsAsync();
        return Ok(requests);
    }

    [HttpPost]
    public async Task<ActionResult<RequestBook>> RequestBook([FromBody] RequestBookDto requestBookDto)
    {
        var requestBook = await _requestBookService.CreateRequestAsync(requestBookDto.UserName, requestBookDto.BookName, requestBookDto.DateIssued, requestBookDto.DateReturn);
        if (requestBook == null)
        {
            return BadRequest("Book is not available");
        }

        return CreatedAtAction(nameof(GetRequests), new { id = requestBook.RequestBookId }, requestBook);
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveRequest(int id)
    {
        await _requestBookService.ApproveRequestAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectRequest(int id)
    {
        await _requestBookService.RejectRequestAsync(id);
        return NoContent();
    }

    [HttpGet("available-books")]
    public async Task<ActionResult<IEnumerable<Book>>> GetAvailableBooks()
    {
        var books = await _requestBookService.GetAvailableBooksAsync();
        return Ok(books);
    }
    [HttpDelete("{requestId}")]
    public async Task<IActionResult> DeleteRequestBook(int requestId)
    {
        var deletedRequest = await _requestBookService.DeleteRequestAsync(requestId);
        if (deletedRequest == null)
        {
            return NotFound(); // Request not found
        }
        return NoContent(); // Request successfully deleted
    }
    [HttpGet("approved-books")]
    public async Task<ActionResult<IEnumerable<RequestBook>>> GetApprovedBooksByDateAsync([FromQuery] DateTime fromDate, [FromQuery] DateTime toDate)
    {
        var approvedBooks = await _requestBookService.GetApprovedBooksByDateAsync(fromDate, toDate);
        return Ok(approvedBooks);
    }
}
