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
    public async Task<IEnumerable<GroupMapDto>> GetGroupMapsAsync(int groupId)
    {
        return await context.GroupMaps
            .Where(x => x.GroupId == groupId)
            .ProjectTo<GroupMapDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }
}
