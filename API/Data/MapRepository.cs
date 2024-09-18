using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MapRepository(DataContext context, IMapper mapper) : IMapRepository
{
    public void AddMap(Map map)
    {
        context.Maps.Add(map);
    }

    public void DeleteMap(Map map)
    {
        context.Maps.Remove(map);
    }

    public async Task<Map?> GetMapAsync(int mapId)
    {
        return await context.Maps
            .FindAsync(mapId);
    }

    public async Task<IEnumerable<MapDto>> GetMapsAsync()
    {
        return await context.Maps
            .ProjectTo<MapDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<MapDto>> GetMapsForHeroAsync(int heroId)
    {
        return await context.Maps
            .Where(x => x.HeroId == heroId)
            .ProjectTo<MapDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
