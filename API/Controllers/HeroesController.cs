using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class HeroesController(IHeroRepository heroRepository, IMapRepository mapRepository,
    IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<HeroDto>>> GetHeroes()
    {
        var heroes = await heroRepository.GetHeroesAsync();
        return Ok(heroes);
    }

    [HttpGet("{heroId}")]
    public async Task<ActionResult<HeroDto>> GetHero(int heroId)
    {
        var hero = await heroRepository.GetHeroAsync(heroId);
        if (hero == null) return BadRequest("Hero does not exist");

        var result = mapper.Map<HeroDto>(hero);
        result.Maps = await mapRepository.GetMapsForHeroAsync(heroId);

        return Ok(result);
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost]
    public async Task<ActionResult<HeroDto>> CreateHero(HeroCreateDto heroCreateDto)
    {
        var hero = mapper.Map<Hero>(heroCreateDto);

        heroRepository.AddHero(hero);

        if (await heroRepository.Complete()) return Ok(mapper.Map<HeroDto>(hero));
        return BadRequest("Failed to create hero");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPut("{heroId}")]
    public async Task<ActionResult<HeroDto>> EditHero(HeroCreateDto heroEditDto, int heroId)
    {
        var hero = await heroRepository.GetHeroAsync(heroId);
        if (hero == null) return BadRequest("Could not find hero");
        
        mapper.Map(heroEditDto, hero);

        if (await heroRepository.Complete()) return Ok(mapper.Map<HeroDto>(hero));
        return BadRequest("Failed to edit hero");
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpDelete("{heroId}")]
    public async Task<ActionResult> DeleteHero(int heroId)
    {
        var hero = await heroRepository.GetHeroAsync(heroId);
        if (hero == null) return BadRequest("Could not find hero");
        
        heroRepository.DeleteHero(hero);

        if (await heroRepository.Complete()) return NoContent();
        return BadRequest("Failed to delete hero");
    }
}
