using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IMapRepository
{
    void AddMap(Map map);
    void DeleteMap(Map map);
    Task<Map?> GetMapAsync(int mapId);
    Task<IEnumerable<MapDto>> GetMapsAsync();
    Task<IEnumerable<MapDto>> GetMapsForHeroAsync(int heroId);
    Task<bool> Complete();
}
