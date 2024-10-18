using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IMapRepository
{
    void AddMap(Map map);
    void DeleteMap(Map map);
    Task<Map?> GetMapAsync(int mapId);
    Task<IEnumerable<MapDto>> GetMapsAsync();
    Task<IEnumerable<Map>> GetMapsRawAsync();
    Task<IEnumerable<MapDto>> GetMapsForHeroAsync(int heroId);
    void AddMapArea(MapArea mapArea);
    void DeleteMapArea(MapArea mapArea);
    Task<MapArea?> GetMapAreaAsync(int mapAreaId);
    Task<IEnumerable<MapAreaDto>> GetMapAreasAsync();
    Task<IEnumerable<MapArea>> GetMapAreasRawAsync();
    Task<bool> Complete();
}
