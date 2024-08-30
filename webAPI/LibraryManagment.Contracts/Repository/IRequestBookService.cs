
namespace Lms.Services.Repository
{
    public interface IRequestBookService
    {
        Task<IEnumerable<RequestBook>> GetAllRequestsAsync();
        Task<RequestBook> CreateRequestAsync(string userName, string bookName, DateTime dateIssued, DateTime? dateReturn);
        Task ApproveRequestAsync(int requestId);
        Task RejectRequestAsync(int requestId);
        Task<IEnumerable<Book>> GetAvailableBooksAsync();
        Task<RequestBook> DeleteRequestAsync(int requestId);
        Task<IEnumerable<RequestBook>> GetApprovedBooksByDateAsync(DateTime fromDate, DateTime toDate);
    }
}