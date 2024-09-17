using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
    IdentityUserToken<int>>(options)
{
    public DbSet<Group> Groups { get; set; }
    public DbSet<UserGroup> UserGroups { get; set; }
    public DbSet<Hero> Heroes { get; set; }
    public DbSet<Map> Maps { get; set; }
    public DbSet<GroupMap> GroupMaps { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        //AppUser - AppRole
        builder.Entity<AppUser>()
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .IsRequired();

        builder.Entity<AppRole>()
            .HasMany(x => x.UserRoles)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .IsRequired();

        //AppUser - Group (Members + Moderators)
        builder.Entity<UserGroup>().HasKey(x => new {x.UserId, x.GroupId});

        builder.Entity<AppUser>()
            .HasMany(x => x.UserGroups)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .IsRequired();

        builder.Entity<Group>()
            .HasMany(x => x.UserGroups)
            .WithOne(x => x.Group)
            .HasForeignKey(x => x.GroupId)
            .IsRequired();

        //AppUser - Group (Owner)
        builder.Entity<AppUser>()
            .HasMany(x => x.OwnerOf)
            .WithOne(x => x.Owner)
            .HasForeignKey(x => x.OwnerId)
            .IsRequired();

        //Hero - Map
        builder.Entity<Hero>()
            .HasMany(x => x.Maps)
            .WithOne(x => x.Hero)
            .HasForeignKey(x => x.HeroId)
            .IsRequired();

        //Group - Map
        builder.Entity<GroupMap>().HasKey(x => new {x.GroupId, x.MapId});

        builder.Entity<Group>()
            .HasMany(x => x.GroupMaps)
            .WithOne(x => x.Group)
            .HasForeignKey(x => x.GroupId)
            .IsRequired();

        builder.Entity<Map>()
            .HasMany(x => x.GroupMaps)
            .WithOne(x => x.Map)
            .HasForeignKey(x => x.MapId)
            .IsRequired();
    }
}
