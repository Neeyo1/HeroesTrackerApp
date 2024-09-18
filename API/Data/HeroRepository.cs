using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class HeroRepository(DataContext context, IMapper mapper) : IHeroRepository
{
    public void AddHero(Hero hero)
    {
        context.Heroes.Add(hero);
    }

    public void DeleteHero(Hero hero)
    {
        context.Heroes.Remove(hero);
    }

    public async Task<Hero?> GetHeroAsync(int heroId)
    {
        return await context.Heroes
            .FindAsync(heroId);
    }

    public async Task<IEnumerable<HeroDto>> GetHeroesAsync()
    {
        return await context.Heroes
            .ProjectTo<HeroDto>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
