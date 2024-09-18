using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IGroupRepository
{
    void AddGroup(Group group);
    void DeleteGroup(Group group);
    Task<Group?> GetGroupAsync(int groupId);
    Task<IEnumerable<GroupDto>> GetGroupsAsync();
    Task<IEnumerable<GroupDto>> GetMyGroupsAsync(int userId);
    void AddUserToGroup(int userId, int groupId, bool isModerator);
    void RemoveUserFromGroup(UserGroup userGroup);
    Task<UserGroup?> GetUserGroupAsync(int userId, int groupId);
    Task<IEnumerable<GroupMemberDto>> GetGroupMembersAsync(int groupId);
    void AddUserToModerators(UserGroup userGroup);
    void RemoveUserFromModerators(UserGroup userGroup);
    Task<IEnumerable<string?>> GetGroupMembersUsernamesAsync(int groupId);
    Task<IEnumerable<string?>> GetGroupModeratorsUsernamesAsync(int groupId);
    Task<bool> IsUserModeratorAsync(int userId, int groupId);
    Task<bool> Complete();
}
