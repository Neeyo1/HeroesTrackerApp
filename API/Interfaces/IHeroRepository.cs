using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IHeroRepository
{
    void AddHero(Hero hero);
    void DeleteHero(Hero hero);
    Task<Hero?> GetHeroAsync(int heroId);
    Task<IEnumerable<HeroDto>> GetHeroesAsync();
    Task<bool> Complete();
}
