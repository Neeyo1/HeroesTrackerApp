namespace API.DTOs;

public class GroupMapDto
{
    public required string MapName { get; set; }
    public DateTime Updated { get; set; }
    public required string UpdatedBy { get; set; }
}
