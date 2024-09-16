using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("GroupMaps")]
public class GroupMap
{
    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public int MapId { get; set; }
    public Map Map { get; set; } = null!;
    public DateTime Updated { get; set; } = DateTime.UtcNow;
    public required string UpdatedBy { get; set; }
}
