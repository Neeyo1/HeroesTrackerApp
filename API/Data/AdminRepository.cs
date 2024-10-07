using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public class AdminRepository(UserManager<AppUser> userManager, IMapper mapper) : IAdminRepository
{
    public async Task<PagedList<MemberWithRolesDto>> GetUsersWithRolesAsync(UserParams userParams)
    {
        var query = userManager.Users.AsQueryable();

        if (userParams.KnownAs != null)
        {
            query = query.Where(x => x.KnownAs == userParams.KnownAs);
        }

        var users = query
            .OrderBy(x => x.UserName)
            .ProjectTo<MemberWithRolesDto>(mapper.ConfigurationProvider);

        users = userParams.Role switch
        {
            "all" => users,
            "admin" => users.Where(x => x.Roles.Contains("Admin")),
            "moderator" => users.Where(x => x.Roles.Contains("Moderator")),
            "user" => users.Where(x => !x.Roles.Contains("Admin") && !x.Roles.Contains("Moderator")),
            _ => users
        };

        return await PagedList<MemberWithRolesDto>.CreateAsync(users, userParams.PageNumber, 
            userParams.PageSize);
    }
}
