using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class GroupCreateDto
{
    [Required] public required string GroupName { get; set; }
    [Required] public required string ServerName { get; set; }
    [Required] public required string Owner { get; set; }
}
