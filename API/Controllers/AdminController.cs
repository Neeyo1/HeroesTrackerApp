using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize(Policy = "RequireAdminRole")]
public class AdminController(IAdminRepository adminRepository, UserManager<AppUser> userManager) : BaseApiController
{
    [HttpGet("users")]
    public async Task<ActionResult> GetUsers([FromQuery] UserParams userParams)
    {
        var users = await adminRepository.GetUsersWithRolesAsync(userParams);
        Response.AddPaginationHeader(users);
        return Ok(users);
    }

    [HttpPost("edit-roles/{userId}/{moderator}")]
    public async Task<ActionResult> EditRoles(string userId, string moderator)
    {
        if (moderator != "true" && moderator != "false")
            return BadRequest("Moderator flag has to be set to either true or false");

        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return BadRequest("User not found");

        var userRoles = await userManager.GetRolesAsync(user);
        if (userRoles.Contains("Admin"))
            return BadRequest("Cannot change roles for admin user");

        if (moderator == "true" && userRoles.Contains("Moderator"))
            return BadRequest("This user is already moderator");

        if (moderator == "false" && !userRoles.Contains("Moderator"))
            return BadRequest("This user is not moderator");
        
        IdentityResult results;

        if (moderator == "true")
            results = await userManager.AddToRoleAsync(user, "Moderator");
        else
            results = await userManager.RemoveFromRoleAsync(user, "Moderator");

        if (!results.Succeeded) return BadRequest("Failed to edit role");

        return Ok(await userManager.GetRolesAsync(user));
    }
}
