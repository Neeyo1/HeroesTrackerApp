using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
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

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost]
    public async Task<ActionResult<MapDto>> CreateMap(MapCreateDto mapCreateDto)
    {
        var map = mapper.Map<Map>(mapCreateDto);

        mapRepository.AddMap(map);

        if (await mapRepository.Complete()) return Ok(mapper.Map<MapDto>(map));
        return BadRequest("Failed to create map");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPut("{mapId}")]
    public async Task<ActionResult<MapDto>> EditMap(MapCreateDto mapEditDto, int mapId)
    {
        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Could not find map");
        
        mapper.Map(mapEditDto, map);

        if (await mapRepository.Complete()) return Ok(mapper.Map<MapDto>(map));
        return BadRequest("Failed to edit map");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("{mapId}")]
    public async Task<ActionResult> DeleteMap(int mapId)
    {
        var map = await mapRepository.GetMapAsync(mapId);
        if (map == null) return BadRequest("Could not find map");
        
        mapRepository.DeleteMap(map);

        if (await mapRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete map");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("all")]
    public async Task<ActionResult> DeleteMaps()
    {
        var maps = await mapRepository.GetMapsRawAsync();
        foreach (var map in maps)
        {
            mapRepository.DeleteMap(map);
        }
        
        if (await mapRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete maps");
    }

    [HttpGet("areas")]
    public async Task<ActionResult<IEnumerable<MapAreaDto>>> GetMapAreas()
    {
        var mapAreas = await mapRepository.GetMapAreasAsync();
        return Ok(mapAreas);
    }

    [HttpGet("areas/{mapAreaId}")]
    public async Task<ActionResult<MapAreaDto>> GetMapArea(int mapAreaId)
    {
        var mapArea = await mapRepository.GetMapAreaAsync(mapAreaId);
        if (mapArea == null) return BadRequest("Map area does not exist");

        return Ok(mapper.Map<MapAreaDto>(mapArea));
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost("areas")]
    public async Task<ActionResult<MapAreaDto>> CreateMaparea(MapAreaCreateDto mapAreaCreateDto)
    {
        var mapArea = mapper.Map<MapArea>(mapAreaCreateDto);

        mapRepository.AddMapArea(mapArea);

        if (await mapRepository.Complete()) return Ok(mapper.Map<MapAreaDto>(mapArea));
        return BadRequest("Failed to create map area");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPut("areas/{mapAreaId}")]
    public async Task<ActionResult<MapAreaDto>> EditMapArea(MapAreaCreateDto mapAreaEditDto, int mapAreaId)
    {
        var mapArea = await mapRepository.GetMapAreaAsync(mapAreaId);
        if (mapArea == null) return BadRequest("Could not find map area");
        
        mapper.Map(mapAreaEditDto, mapArea);

        if (await mapRepository.Complete()) return Ok(mapper.Map<MapAreaDto>(mapArea));
        return BadRequest("Failed to edit map area");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("areas/{mapAreaId}")]
    public async Task<ActionResult> DeleteMapArea(int mapAreaId)
    {
        var mapArea = await mapRepository.GetMapAreaAsync(mapAreaId);
        if (mapArea == null) return BadRequest("Could not find map area");
        
        mapRepository.DeleteMapArea(mapArea);

        if (await mapRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete map area");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("areas/all")]
    public async Task<ActionResult> DeleteMapAreas()
    {
        var mapAreas = await mapRepository.GetMapAreasRawAsync();
        foreach (var mapArea in mapAreas)
        {
            mapRepository.DeleteMapArea(mapArea);
        }
        
        if (await mapRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete map areas");
    }
}
