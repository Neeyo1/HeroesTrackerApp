using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class GroupsController(IGroupRepository groupRepository, IUserRepository userRepository,
    IGroupMapRepository groupMapRepository, IMapRepository mapRepository, 
    UserManager<AppUser> userManager, IMapper mapper) : BaseApiController
{
    [Authorize(Policy = "RequireModeratorRole")]
    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroups([FromQuery] GroupParams groupParams)
    {
        var groups = await groupRepository.GetGroupsAsync(groupParams);

        var count = 0;
        foreach (var group in groups)
        {
            groups[count].Members = await groupRepository.GetGroupMembersAsync(group.Id);
            count++;
        }

        Response.AddPaginationHeader(groups);
        return Ok(groups);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDto>>> GetMyGroups([FromQuery] GroupParams groupParams)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var groups = await groupRepository.GetMyGroupsAsync(user.Id, groupParams);
        
        var count = 0;
        foreach (var group in groups)
        {
            groups[count].Members = await groupRepository.GetGroupMembersAsync(group.Id);
            count++;
        }
        Response.AddPaginationHeader(groups);
        return Ok(groups);
    }

    [HttpGet("{groupId}")]
    public async Task<ActionResult<GroupDto>> GetGroup(int groupId, [FromQuery] string? withMembers)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Group does not exist");

        if(!await IsUserInGroup(user.Id, groupId) && !await IsUserAdmin(user))
            return Unauthorized();

        if (withMembers == "true") {
            var members = await groupRepository.GetGroupMembersAsync(groupId);
            var result = mapper.Map<GroupDto>(group);
            result.Members = members;
            return Ok(result);
        }

        return Ok(mapper.Map<GroupDto>(group));
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(GroupCreateDto groupCreateDto)
    {
        var owner = await userRepository.GetUserByUsernameAsync(groupCreateDto.Owner.ToLower());
        if (owner == null) return BadRequest("Could not find user");

        if (await groupRepository.GetGroupByGroupNameAndServerNameAsync(groupCreateDto.GroupName,
            groupCreateDto.ServerName) != null)
        {
            return BadRequest("Group with this group name and server name already exists");
        }

        var group = new Group
        {
            GroupName = groupCreateDto.GroupName,
            ServerName = groupCreateDto.ServerName
        };
        group.Owner = owner;

        groupRepository.AddGroup(group);

        if (!await groupRepository.Complete()) return BadRequest("Failed to create group");

        groupRepository.AddUserToGroup(owner.Id, group.Id, false);
        group.MembersCount++;

        if (await groupRepository.Complete()) return Ok(mapper.Map<GroupDto>(group));
        return BadRequest("Failed to add owner to group");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPut("{groupId}")]
    public async Task<ActionResult<GroupDto>> EditGroup(GroupCreateDto groupEditDto, int groupId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId != user.Id) return Unauthorized();
        
        mapper.Map(groupEditDto, group);

        if (await groupRepository.Complete()) return Ok(mapper.Map<GroupDto>(group));
        return BadRequest("Failed to edit group");
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("{groupId}")]
    public async Task<ActionResult> DeleteGroup(int groupId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId != user.Id && !await IsUserAdmin(user)) return Unauthorized();
        
        groupRepository.DeleteGroup(group);

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete group");
    }

    [HttpGet("members/{groupId}")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembersForGroup(int groupId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if(!await IsUserInGroup(user.Id, groupId) && !await IsUserAdmin(user))
            return Unauthorized();

        var members = await groupRepository.GetGroupMembersAsync(groupId);
        return Ok(members);
    }

    [HttpPut("members/{groupId}")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> AddOrRemoveMemberForGroup(int groupId, [FromQuery]string userToEditKnownAs, string? isMod)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var userToEdit = await userRepository.GetUserByKnownAsAsync(userToEditKnownAs);
        if (userToEdit == null) return BadRequest("Could not find user to edit");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId == userToEdit.Id) return BadRequest("Group owner cannot be removed from group");
        if (group.OwnerId != user.Id && !await groupRepository.IsUserModeratorAsync(user.Id, groupId)
            && !await IsUserAdmin(user))
                return Unauthorized();

        var action = "";
        var membersUsernames = await groupRepository.GetGroupMembersUsernamesAsync(groupId);
        if (!membersUsernames.Contains(userToEdit.UserName))
        {
            if ((group.OwnerId == user.Id || await IsUserAdmin(user)) && isMod == "true")
            {
                groupRepository.AddUserToGroup(userToEdit.Id, groupId, true);
            } else 
            {
                groupRepository.AddUserToGroup(userToEdit.Id, groupId, false);
            }
            group.MembersCount++;
            action = "add";
        } else
        {
            if (await groupRepository.IsUserModeratorAsync(userToEdit.Id, groupId)
                && group.OwnerId != user.Id && !await IsUserAdmin(user))
            {
                return BadRequest("You cannot remove moderator user without permissions to do so");
            }
            var userGroup = await groupRepository.GetUserGroupAsync(userToEdit.Id, groupId);
            if (userGroup == null) return BadRequest("Could not find usergroup");

            groupRepository.RemoveUserFromGroup(userGroup);
            group.MembersCount--;
            action = "remove";
        }

        if (await groupRepository.Complete())
        {
            if (action == "add") return Ok(mapper.Map<MemberDto>(userToEdit));
            if (action == "remove") return NoContent();
        } 
        return BadRequest("Failed to edit member");
    }

    [HttpPost("members/{groupId}/leave")]
    public async Task<ActionResult> LeaveGroup(int groupId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId == user.Id) return BadRequest("Group owner cannot leave group");

        var userGroup = await groupRepository.GetUserGroupAsync(user.Id, groupId);
        if (userGroup == null) return BadRequest("You are not member of this group");

        groupRepository.RemoveUserFromGroup(userGroup);
        group.MembersCount--;

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to edit member");
    }

    [HttpPut("moderators/{groupId}")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> AddOrRemoveModeratorForGroup(int groupId, [FromQuery]int userToEditId, string mod)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var userToEdit = await userRepository.GetUserByIdAsync(userToEditId);
        if (userToEdit == null) return BadRequest("Could not find user to edit");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId == userToEdit.Id) return BadRequest("Cannot set owner as moderator");
        if (group.OwnerId != user.Id && !await IsUserAdmin(user))
            return Unauthorized();

        if (mod != "true" && mod != "false") return BadRequest("Mod has to be set to either true or false");

        var userGroup = await groupRepository.GetUserGroupAsync(userToEdit.Id, groupId);
        if (userGroup == null) return BadRequest("Could not find usergroup");

        var isUserModerator = await groupRepository.IsUserModeratorAsync(userToEdit.Id, groupId);
        if (isUserModerator && mod == "false")
        {
            groupRepository.RemoveUserFromModerators(userGroup);
        } else
        if (!isUserModerator && mod == "true")
        {
            groupRepository.AddUserToModerators(userGroup);
        }

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to edit moderators");
    }

    [HttpGet("{groupId}/maps")]
    public async Task<ActionResult<IEnumerable<GroupMapDto>>> GetGroupMaps(int groupId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        if(!await IsUserInGroup(user.Id, groupId) && !await IsUserAdmin(user))
            return Unauthorized();

        var groupMaps = await groupMapRepository.GetGroupMapsAsync(groupId);
        return Ok(groupMaps);
    }

    [HttpGet("{groupId}/maps/{mapId}")]
    public async Task<ActionResult<GroupMapDto>> GetGroupMap(int groupId, int mapId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        if(!await IsUserInGroup(user.Id, groupId) && !await IsUserAdmin(user))
            return Unauthorized();

        var groupMap = await groupMapRepository.GetGroupMapAsync(groupId, mapId);
        if (groupMap == null) return BadRequest("Groupmap does not exist");

        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Map does not exist");

        var result = mapper.Map<GroupMapDto>(groupMap);
        result.MapName = map.Name;

        return Ok(result);
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost("{groupId}/maps/{mapId}")]
    public async Task<ActionResult<GroupMapDto>> CreateGroupMapForGroup(int groupId, int mapId)
    {
        var groupMap = new GroupMap
        {
            GroupId = groupId,
            MapId = mapId,
            UpdatedBy = "(system)"
        };

        groupMapRepository.AddGroupMap(groupMap);

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to add groupmap");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost("{groupId}/maps/all")]
    public async Task<ActionResult<GroupMapDto>> CreateGroupMapsForGroup(int groupId)
    {
        var maps = await mapRepository.GetMapsAsync();
        foreach (var map in maps)
        {
            if (await groupMapRepository.GetGroupMapAsync(groupId, map.Id) == null)
            {
                var groupMap = new GroupMap
                {
                    GroupId = groupId,
                    MapId = map.Id,
                    UpdatedBy = "(system)"
                };
                groupMapRepository.AddGroupMap(groupMap);
            }
        }

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to add groupmaps");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost("all/maps/all")]
    public async Task<ActionResult<GroupMapDto>> CreateGroupMapsForAll()
    {
        var groups = await groupRepository.GetAllGroupsAsync();
        var maps = await mapRepository.GetMapsAsync();
        foreach (var group in groups)
        {
            foreach (var map in maps)
            {
                if (await groupMapRepository.GetGroupMapAsync(group.Id, map.Id) == null)
                {
                    var groupMap = new GroupMap
                    {
                        GroupId = group.Id,
                        MapId = map.Id,
                        UpdatedBy = "(system)"
                    };
                    groupMapRepository.AddGroupMap(groupMap);
                }
            }
        }

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to add all groupmaps");
    }

    [HttpPut("{groupId}/maps/{mapId}")]
    public async Task<ActionResult<GroupMapDto>> EditGroupMap(int groupId, int mapId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null || user.UserName == null) return BadRequest("Could not find user");

        if(!await IsUserInGroup(user.Id, groupId) && !await IsUserAdmin(user))
            return Unauthorized();

        var groupMap = await groupMapRepository.GetGroupMapAsync(groupId, mapId);
        if (groupMap == null) return BadRequest("Could not find groupmap");
        
        groupMap.Updated = DateTime.UtcNow;
        groupMap.UpdatedBy = user.KnownAs;

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to edit groupmap");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("{groupId}/maps")]
    public async Task<ActionResult<GroupMapDto>> DeleteGroupMapsForGroup(int groupId)
    {
        var groupMaps = await groupMapRepository.GetGroupMapsRawAsync(groupId);
        foreach (var groupMap in groupMaps)
        {
            groupMapRepository.DeleteGroupMap(groupMap);
        }

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete all groupmaps for group");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("all/maps")]
    public async Task<ActionResult<GroupMapDto>> DeleteGroupMapsForAll()
    {
        var groups = await groupRepository.GetAllGroupsAsync();
        foreach (var group in groups)
        {
            var groupMaps = await groupMapRepository.GetGroupMapsRawAsync(group.Id);
            foreach (var groupMap in groupMaps)
            {
                groupMapRepository.DeleteGroupMap(groupMap);
            }
        }
        
        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete all groupmaps for all groups");
    }

    private async Task<bool> IsUserInGroup(int userId, int groupId)
    {
        return await groupRepository.GetUserGroupAsync(userId, groupId) != null;
    }

    private async Task<bool> IsUserAdmin(AppUser user)
    {
        var userRoles = await userManager.GetRolesAsync(user);
        return userRoles.Contains("Admin");
    }
}
