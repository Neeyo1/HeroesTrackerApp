using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

[Table("UserGroups")]
public class UserGroup
{
    public int UserId { get; set; }
    public AppUser User { get; set; } = null!;
    public int GroupId { get; set; }
    public Group Group { get; set; } = null!;
    public bool IsModerator { get; set; } = false;
}
