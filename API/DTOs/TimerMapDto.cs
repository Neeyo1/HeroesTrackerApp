namespace API.DTOs;

public class TimerMapDto
{
    public required string MapName { get; set; }
    public DateTime Updated { get; set; }
    public required string UpdatedBy { get; set; }
}
