public class RequestBookDto
{
    public string UserName { get; set; }
    public string BookName { get; set; }
    public DateTime DateIssued { get; set; }
    public DateTime? DateReturn { get; set; }
}
