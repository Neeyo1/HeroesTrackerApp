using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Heroes")]
public class Hero
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int Level { get; set; }

    //Hero - Map
    public ICollection<Map> Maps { get; set; } = [];
}
