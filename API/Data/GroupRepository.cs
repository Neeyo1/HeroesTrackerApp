using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class GroupRepository(DataContext context, IMapper mapper) : IGroupRepository
{
    public void AddGroup(Group group)
    {
        context.Groups.Add(group);
    }

    public void DeleteGroup(Group group)
    {
        context.Groups.Remove(group);
    }

    public async Task<Group?> GetGroupAsync(int groupId)
    {
        return await context.Groups
            .Include(x => x.Owner)
            .FirstOrDefaultAsync(x => x.Id == groupId);
    }

    public async Task<IEnumerable<GroupDto>> GetGroupsAsync()
    {
        return await context.Groups
            .ProjectTo<GroupDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<GroupDto>> GetMyGroupsAsync(int userId)
    {
        return await context.UserGroups
            .Where(x => x.UserId == userId)
            .Select(x => x.Group)
            .ProjectTo<GroupDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public void AddUserToGroup(int userId, int groupId, bool isModerator)
    {
        var userGroup = new UserGroup
        {
            UserId = userId,
            GroupId = groupId,
            IsModerator = isModerator
        };
        context.UserGroups.Add(userGroup);
    }

    public void RemoveUserFromGroup(UserGroup userGroup)
    {
        context.UserGroups.Remove(userGroup);
    }

    public async Task<UserGroup?> GetUserGroupAsync(int userId, int groupId)
    {
        return await context.UserGroups
            .Where(x => x.GroupId == groupId)
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }

    public async Task<IEnumerable<GroupMemberDto>> GetGroupMembersAsync(int groupId)
    {
        return await context.UserGroups
            .Where(x => x.GroupId == groupId)
            .ProjectTo<GroupMemberDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public void AddUserToModerators(UserGroup userGroup)
    {
        userGroup.IsModerator = true;
    }

    public void RemoveUserFromModerators(UserGroup userGroup)
    {
        userGroup.IsModerator = false;
    }

    public async Task<IEnumerable<string?>> GetGroupMembersUsernamesAsync(int groupId)
    {
        return await context.UserGroups
            .Where(x => x.GroupId == groupId)
            .Select(x => x.User.UserName)
            .ToListAsync();
    }
    public async Task<IEnumerable<string?>> GetGroupModeratorsUsernamesAsync(int groupId)
    {
        return await context.UserGroups
            .Where(x => x.GroupId == groupId && x.IsModerator == true)
            .Select(x => x.User.UserName)
            .ToListAsync();
    }

    public async Task<bool> IsUserModeratorAsync(int userId, int groupId)
    {
        var userGroup = await GetUserGroupAsync(userId, groupId);
        if (userGroup == null) return false;
        return userGroup.IsModerator;
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
