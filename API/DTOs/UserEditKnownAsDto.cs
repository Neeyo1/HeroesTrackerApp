using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserEditKnownAsDto
{
    [Required]
    [StringLength(12, MinimumLength = 4)]
    public required string KnownAs { get; set; }
}