namespace API.DTOs;

public class MapDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int HeroId { get; set; }
    public int MapAreaId { get; set; }
}
