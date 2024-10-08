using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("Groups")]
public class Group
{
    public int Id { get; set; }
    public required string GroupName { get; set; }
    public required string ServerName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int MembersCount { get; set; }

    //Group - AppUser (Members)
    public ICollection<UserGroup> UserGroups { get; set; } = [];

    //Group - AppUser (Owner)
    public int OwnerId { get; set; }
    public AppUser Owner { get; set; } = null!;

    //Group - Map
    public ICollection<GroupMap> GroupMaps { get; set; } = [];
}
