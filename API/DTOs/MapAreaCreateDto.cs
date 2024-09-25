using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MapAreaCreateDto
{
    [Required] public required string Name { get; set; }
}
