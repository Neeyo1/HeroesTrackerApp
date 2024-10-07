using API.DTOs;
using API.Helpers;

namespace API.Interfaces;

public interface IAdminRepository
{
    Task<PagedList<MemberWithRolesDto>> GetUsersWithRolesAsync(UserParams userParams);
}
