using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IGroupMapRepository
{
    void AddGroupMap(GroupMap groupMap);
    Task<GroupMap?> GetGroupMapAsync(int groupId, int mapId);
    Task<IEnumerable<GroupMapDto>> GetGroupMapsAsync(int groupId);
}