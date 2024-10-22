using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IGroupRepository
{
    void AddGroup(Group group);
    void DeleteGroup(Group group);
    Task<Group?> GetGroupAsync(int groupId);
    Task<Group?> GetGroupByGroupNameAndServerNameAsync(string groupName, string serverName);
    Task<PagedList<GroupDto>> GetGroupsAsync(GroupParams groupParams);
    Task<IEnumerable<GroupDto>> GetAllGroupsAsync();
    Task<PagedList<GroupDto>> GetMyGroupsAsync(int userId, GroupParams groupParams);
    void AddUserToGroup(int userId, int groupId, bool isModerator);
    void RemoveUserFromGroup(UserGroup userGroup);
    Task<UserGroup?> GetUserGroupAsync(int userId, int groupId);
    Task<IEnumerable<GroupMemberDto>> GetGroupMembersAsync(int groupId);
    void AddUserToModerators(UserGroup userGroup);
    void RemoveUserFromModerators(UserGroup userGroup);
    Task<IEnumerable<string?>> GetGroupMembersUsernamesAsync(int groupId);
    Task<IEnumerable<string?>> GetGroupModeratorsUsernamesAsync(int groupId);
    Task<bool> IsUserModeratorAsync(int userId, int groupId);
    Task<bool> GroupExistsAsync(string groupName, string serverName);
    Task<bool> Complete();
}
