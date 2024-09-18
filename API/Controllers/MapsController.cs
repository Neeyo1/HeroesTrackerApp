using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MapsController(IMapRepository mapRepository, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MapDto>>> GetMaps()
    {
        var maps = await mapRepository.GetMapsAsync();
        return Ok(maps);
    }

    [HttpGet("{mapId}")]
    public async Task<ActionResult<MapDto>> GetMap(int mapId)
    {
        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Map does not exist");

        return Ok(mapper.Map<MapDto>(map));
    }

    [HttpPost]
    public async Task<ActionResult<MapDto>> CreateMap(MapCreateDto mapCreateDto)
    {
        var map = mapper.Map<Map>(mapCreateDto);

        mapRepository.AddMap(map);

        if (await mapRepository.Complete()) return Ok(mapper.Map<MapDto>(map));
        return BadRequest("Failed to create map");
    }

    [HttpPut("{mapId}")]
    public async Task<ActionResult<MapDto>> EditMap(MapCreateDto mapEditDto, int mapId)
    {
        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Could not find map");
        
        mapper.Map(mapEditDto, map);

        if (await mapRepository.Complete()) return Ok(mapper.Map<MapDto>(map));
        return BadRequest("Failed to edit map");
    }

    [HttpDelete("{mapId}")]
    public async Task<ActionResult> DeleteHero(int mapId)
    {
        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Could not find map");
        
        mapRepository.DeleteMap(map);

        if (await mapRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete map");
    }
}
