using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Maps")]
public class Map
{
    public int Id { get; set; }
    public required string Name { get; set; }

    //Map - Hero
    public int HeroId { get; set; }
    public Hero Hero { get; set; } = null!;

    //Map - Group
    public ICollection<GroupMap> GroupMaps { get; set; } = [];
}
