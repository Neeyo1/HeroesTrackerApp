using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class HeroCreateDto
{
    [Required] public required string Name { get; set; }
    [Required] public int Level { get; set; }
}
