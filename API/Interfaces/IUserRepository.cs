using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IUserRepository
{
    Task<IEnumerable<MemberDto>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(int userId);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<AppUser?> GetUserByKnownAsAsync(string knownAs);
    Task<bool> Complete();
}
