﻿public class Genre
{
    public int GenreId { get; set; }
    public string GenreType { get; set; }
    public ICollection<Book> Books { get; set; } // Navigation property
}
