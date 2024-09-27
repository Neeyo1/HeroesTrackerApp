namespace API.DTOs;

public class TimerHeroDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int Level { get; set; }
    public IEnumerable<TimerMapAreaDto> Locations { get; set; } = [];
}
