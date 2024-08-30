namespace LibraryManagementAPI.Models
{
    public class BookDTO
    {
        public int BookId { get; set; }
        public string BookName { get; set; }
        public string Author { get; set; }
        public DateTime DatePublished { get; set; }
        public string GenreType { get; set; } // Assuming GenreType is a string representing the genre name
        public int Quantity { get; set; }
    }
}
