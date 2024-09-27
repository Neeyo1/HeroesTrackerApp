namespace API.DTOs;

public class TimerMapAreaDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public IEnumerable<TimerMapDto> Maps { get; set; } = [];
}
