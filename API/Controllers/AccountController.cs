using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService,
    IMapper mapper, IUserRepository userRepository) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");
        if (await KnownAsExists(registerDto.KnownAs)) return BadRequest("Nickname is taken");

        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        await userManager.AddToRoleAsync(user, "User");

        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        return userToReturn;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.Users
            .SingleOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());
        if (user == null || user.UserName == null) return BadRequest("Invalid username or password");
        if (!await userManager.CheckPasswordAsync(user, loginDto.Password))
            return BadRequest("Invalid username or password");

        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        return userToReturn;
    }

    [HttpPut("edit")]
    public async Task<ActionResult<UserDto>> UserEditKnownAs(UserEditKnownAsDto userEditKnownAsDto)
    {
        var user = await userManager.FindByNameAsync(User.GetUsername());
        if (user == null) return BadRequest("User not found");

        var userRoles = await userManager.GetRolesAsync(user);
        if (userRoles.Contains("Admin"))
            return BadRequest("Cannot change nickname as an admin");

        if (user.KnownAs == userEditKnownAsDto.KnownAs) return BadRequest("This is your current nickname");
        else
        {
            if (await KnownAsExists(userEditKnownAsDto.KnownAs)) return BadRequest("Nickname is taken");
            else user.KnownAs = userEditKnownAsDto.KnownAs;
        }
        
        if (await userRepository.Complete())
        {
            var userToReturn = mapper.Map<UserDto>(user);
            userToReturn.Token = await tokenService.CreateToken(user);

            return userToReturn;
        }
        return BadRequest("Failed to update user");
    }

    [HttpPut("change-password")]
    public async Task<ActionResult<UserDto>> UserEditPassword(UserEditPasswordDto userEditPasswordDto)
    {
        var user = await userManager.FindByNameAsync(User.GetUsername());
        if (user == null) return BadRequest("User not found");

        var result = await userManager.ChangePasswordAsync(user, userEditPasswordDto.OldPassword, 
            userEditPasswordDto.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);
        
        var userToReturn = mapper.Map<UserDto>(user);
        userToReturn.Token = await tokenService.CreateToken(user);

        return userToReturn;
    }

    private async Task<bool> UserExists(string username)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }

    private async Task<bool> KnownAsExists(string knownAs)
    {
        return await userManager.Users.AnyAsync(x => x.KnownAs == knownAs);
    }
}
