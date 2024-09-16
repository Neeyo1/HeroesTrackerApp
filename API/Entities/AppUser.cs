using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser<int>
{
    public required string KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    //AppUser - AppUserRole
    public ICollection<AppUserRole> UserRoles { get; set; } = [];

    //AppUser - Group (Members)
    public ICollection<UserGroup> UserGroups { get; set; } = [];

    //AppUser - Group (Owner)
    public ICollection<Group> OwnerOf { get; set; } = [];
}
