using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MapCreateDto
{
    [Required] public required string Name { get; set; }
    [Required] public int HeroId { get; set; }
}
