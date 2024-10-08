using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UserEditDto
{
    [Required] public required string KnownAs { get; set; }
}