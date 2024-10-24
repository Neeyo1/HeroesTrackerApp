using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<RegisterDto, AppUser>();
        CreateMap<AppUser, UserDto>();
        CreateMap<AppUser, MemberDto>();
        CreateMap<Group, GroupDto>();
        CreateMap<GroupCreateDto, Group>();
        CreateMap<UserGroup, GroupMemberDto>()
            .ForMember(x => x.Id, y => y.MapFrom(z => z.UserId))
            .ForMember(x => x.Username, y => y.MapFrom(z => z.User.UserName))
            .ForMember(x => x.KnownAs, y => y.MapFrom(z => z.User.KnownAs))
            .ForMember(x => x.IsModerator, y => y.MapFrom(z => z.IsModerator));
        CreateMap<Hero, HeroDto>();
        CreateMap<HeroCreateDto, Hero>();
        CreateMap<Map, MapDto>();
        CreateMap<MapCreateDto, Map>();
        CreateMap<GroupMap, GroupMapDto>()
            .ForMember(x => x.MapName, y => y.MapFrom(z => z.Map.Name))
            .ForMember(x => x.MapAreaId, y => y.MapFrom(z => z.Map.MapAreaId))
            .ForMember(x => x.MapAreaName, y => y.MapFrom(z => z.Map.MapArea.Name))
            .ForMember(x => x.HeroId, y => y.MapFrom(z => z.Map.HeroId));
        CreateMap<MapArea, MapAreaDto>();
        CreateMap<MapAreaCreateDto, MapArea>();
        CreateMap<Hero, TimerHeroDto>();
        CreateMap<AppUser, MemberWithRolesDto>()
            .ForMember(x => x.Username, y => y.MapFrom(z => z.UserName))
            .ForMember(x => x.Roles, y => y.MapFrom(z => z.UserRoles.Select(r => r.Role.Name).ToList()));
        CreateMap<DateTime, DateTime>().ConvertUsing(x => DateTime.SpecifyKind(x, DateTimeKind.Utc));
        CreateMap<DateTime?, DateTime?>().ConvertUsing(x => x.HasValue 
            ? DateTime.SpecifyKind(x.Value, DateTimeKind.Utc) : null);
    }
}
