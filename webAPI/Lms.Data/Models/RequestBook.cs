using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class RequestBook
{
    public int RequestBookId { get; set; }

    public string UserName { get; set; }
    public string BookName { get; set; }

    [ForeignKey("Book")]
    public int BookId { get; set; } // Foreign key for Book

    public Book Book { get; set; } // Navigation property


    public DateTime DateIssued { get; set; }

    public DateTime? DateReturn { get; set; }

    [Required]
    public RequestStatus Status { get; set; } = RequestStatus.Processing;
}

public enum RequestStatus
{
    Processing,
    Accepted,
    Rejected
}
