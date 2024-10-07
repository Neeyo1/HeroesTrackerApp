using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminController(IAdminRepository adminRepository) : BaseApiController
{
    [HttpGet("users")]
    public async Task<ActionResult> GetUsers([FromQuery] UserParams userParams)
    {
        var users = await adminRepository.GetUsersWithRolesAsync(userParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
    }
}
