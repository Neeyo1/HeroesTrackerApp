using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class GroupsController(IGroupRepository groupRepository, IUserRepository userRepository,
    IGroupMapRepository groupMapRepository, IMapRepository mapRepository, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDto>>> GetGroups()
    {
        var groups = await groupRepository.GetGroupsAsync();
        return Ok(groups);
    }

    [HttpGet("{groupId}")]
    public async Task<ActionResult<GroupDto>> GetGroup(int groupId)
    {
        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Group does not exist");

        return Ok(mapper.Map<GroupDto>(group));
    }

    [HttpPost]
    public async Task<ActionResult<GroupDto>> CreateGroup(GroupCreateDto groupCreateDto)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = mapper.Map<Group>(groupCreateDto);
        group.Owner = user;

        groupRepository.AddGroup(group);

        if (!await groupRepository.Complete()) return BadRequest("Failed to create group");

        groupRepository.AddUserToGroup(user.Id, group.Id, false);
        group.MembersCount++;

        if (await groupRepository.Complete()) return Ok(mapper.Map<GroupDto>(group));
        return BadRequest("Failed to add owner to group");
    }

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

    [HttpDelete("{groupId}")]
    public async Task<ActionResult> DeleteGroup(int groupId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId != user.Id) return Unauthorized();
        
        groupRepository.DeleteGroup(group);

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete group");
    }

    [HttpGet("members/{groupId}")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembersForGroup(int groupId)
    {
        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        var members = groupRepository.GetGroupMembersAsync(groupId);
        return Ok(members.Result);
    }

    [HttpPut("members/{groupId}")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> AddOrRemoveMemberForGroup(int groupId, [FromQuery]int userToEditId, string? isMod)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("Could not find user");

        var userToEdit = await userRepository.GetUserByIdAsync(userToEditId);
        if (userToEdit == null) return BadRequest("Could not find user to edit");

        var group = await groupRepository.GetGroupAsync(groupId);
        if (group == null) return BadRequest("Could not find group");

        if (group.OwnerId == userToEdit.Id) return BadRequest("Group owner cannot be removed from group");
        if (group.OwnerId != user.Id && !await groupRepository.IsUserModerator(user.Id, groupId))
            return Unauthorized();

        var membersUsernames = await groupRepository.GetGroupMembersUsernamesAsync(groupId);
        if (!membersUsernames.Contains(userToEdit.UserName))
        {
            if (group.OwnerId == user.Id && isMod == "true")
            {
                groupRepository.AddUserToGroup(userToEditId, groupId, true);
            } else 
            {
                groupRepository.AddUserToGroup(userToEditId, groupId, false);
            }
            group.MembersCount++;
        } else
        {
            if (await groupRepository.IsUserModerator(userToEditId, groupId) && group.OwnerId != user.Id)
            {
                return BadRequest("You cannot remove moderator user without permissions to do so");
            }
            var userGroup = await groupRepository.GetUserGroupAsync(userToEditId, groupId);
            if (userGroup == null) return BadRequest("Could not find usergroup");

            groupRepository.RemoveUserFromGroup(userGroup);
            group.MembersCount--;
        }

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
        if (group.OwnerId != user.Id)
            return Unauthorized();

        if (mod != "true" && mod != "false") return BadRequest("Mod has to be set to either true or false");

        var userGroup = await groupRepository.GetUserGroupAsync(userToEditId, groupId);
        if (userGroup == null) return BadRequest("Could not find usergroup");

        if (await groupRepository.IsUserModerator(userToEditId, groupId) && mod == "false")
        {
            groupRepository.RemoveUserFromModerators(userGroup);
        } else
        if (!await groupRepository.IsUserModerator(userToEditId, groupId) && mod == "true")
        {
            groupRepository.AddUserToModerators(userGroup);
        }

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to edit moderators");
    }

    [HttpGet("{groupId}/maps")]
    public async Task<ActionResult<IEnumerable<GroupMapDto>>> GetGroupMaps(int groupId)
    {
        var groupMaps = await groupMapRepository.GetGroupMapsAsync(groupId);
        return Ok(groupMaps);
    }

    [HttpGet("{groupId}/maps/{mapId}")]
    public async Task<ActionResult<GroupMapDto>> GetGroupMap(int groupId, int mapId)
    {
        var groupMap = await groupMapRepository.GetGroupMapAsync(groupId, mapId);
        if (groupMap == null) return BadRequest("Groupmap does not exist");

        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Map does not exist");

        var result = mapper.Map<GroupMapDto>(groupMap);
        result.MapName = map.Name;

        return Ok(result);
    }

    [HttpPost("{groupId}/maps/{mapId}")]
    public async Task<ActionResult<GroupMapDto>> CreateGroupMap(int groupId, int mapId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null || user.UserName == null) return BadRequest("Could not find user");

        var groupMap = new GroupMap
        {
            GroupId = groupId,
            MapId = mapId,
            UpdatedBy = user.KnownAs + "(admin)"
        };

        groupMapRepository.AddGroupMap(groupMap);

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to add groupmap");
    }

    [HttpPut("{groupId}/maps/{mapId}")]
    public async Task<ActionResult<GroupMapDto>> EditGroupMap(int groupId, int mapId)
    {
        var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null || user.UserName == null) return BadRequest("Could not find user");

        var groupMap = await groupMapRepository.GetGroupMapAsync(groupId, mapId);
        if (groupMap == null) return BadRequest("Could not find groupmap");
        
        groupMap.Updated = DateTime.UtcNow;
        groupMap.UpdatedBy = user.KnownAs;

        if (await groupRepository.Complete()) return NoContent();
        return BadRequest("Failed to edit groupmap");
    }
}
