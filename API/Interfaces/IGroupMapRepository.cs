using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IGroupMapRepository
{
    void AddGroupMap(GroupMap groupMap);
    Task<GroupMap?> GetGroupMapAsync(int groupId, int mapId);
    Task<GroupMap?> GetGroupMapByMapNameAsync(int groupId, string mapName);
    Task<IEnumerable<GroupMapDto>> GetGroupMapsAsync(int groupId);
    Task<IEnumerable<GroupMapDto>> GetGroupMapsForHeroAsync(int groupId, int heroId);
    Task<IEnumerable<GroupMap>> GetGroupMapsRawAsync(int groupId);
    void DeleteGroupMap(GroupMap groupMap);
}
