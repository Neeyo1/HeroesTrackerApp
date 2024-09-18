namespace API.DTOs;

public class HeroDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int Level { get; set; }
    public IEnumerable<MapDto> Maps { get; set; } = [];
}
