using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class GroupMapRepository(DataContext context, IMapper mapper) : IGroupMapRepository
{
    public void AddGroupMap(GroupMap groupMap)
    {
        context.GroupMaps.Add(groupMap);
    }

    public async Task<GroupMap?> GetGroupMapAsync(int groupId, int mapId)
    {
        return await context.GroupMaps
            .Where(x => x.GroupId == groupId)
            .FirstOrDefaultAsync(x => x.MapId == mapId);
    }

    public async Task<GroupMap?> GetGroupMapByMapNameAsync(int groupId, string mapName)
    {
        return await context.GroupMaps
            .Include(x => x.Map)
            .Where(x => x.GroupId == groupId)
            .FirstOrDefaultAsync(x => x.Map.Name == mapName);
    }
    
    public async Task<IEnumerable<GroupMapDto>> GetGroupMapsAsync(int groupId)
    {
        return await context.GroupMaps
            .Where(x => x.GroupId == groupId)
            .ProjectTo<GroupMapDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<GroupMapDto>> GetGroupMapsForHeroAsync(int groupId, int heroId)
    {
        return await context.GroupMaps
            .Where(x => x.GroupId == groupId && x.Map.HeroId == heroId)
            .ProjectTo<GroupMapDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<GroupMap>> GetGroupMapsRawAsync(int groupId)
    {
        return await context.GroupMaps
            .Where(x => x.GroupId == groupId)
            .ToListAsync();
    }

    public void DeleteGroupMap(GroupMap groupMap)
    {
        context.GroupMaps.Remove(groupMap);
    }
}
