using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Book
{
    
    public int BookId { get; set; }

    
    public string BookName { get; set; }

    
    public string Author { get; set; }

    
    public DateTime DatePublished { get; set; }

    
    [ForeignKey("Genre")]
    public int GenreId { get; set; } // Foreign key for Genre

    public Genre Genre { get; set; } // Navigation property

    
    public int Quantity { get; set; }
}
