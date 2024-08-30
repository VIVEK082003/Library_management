using System.ComponentModel.DataAnnotations;

public class LoginDTO
{
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }

    [Required]
    [StringLength(100)]
    public string? Password { get; set; }
}
