using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("MapAreas")]
public class MapArea
{
    public int Id { get; set; }
    public required string Name { get; set; }

    //MapArea - Map
    public ICollection<Map> Maps { get; set; } = [];
}
