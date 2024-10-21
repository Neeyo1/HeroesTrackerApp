using System.Text.Json;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class TimerHub(IGroupRepository groupRepository, IUserRepository userRepository,
    IGroupMapRepository groupMapRepository, IHeroRepository heroRepository) : Hub
{
    public override async Task OnConnectedAsync()
    {
        (string groupName, string serverName, AppUser user, Group group) = await ValidateData(Context);

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName + "_" + serverName);

        //await Clients.Caller.SendAsync("NewMessage", "TestMessage");
        await GetTimers();
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    public async Task GetTimers()
    {
        (string groupName, string serverName, AppUser user, Group group) = await ValidateData(Context);

        var heroes = await heroRepository.GetTimerHeroesAsync();
        //var groupMaps = await groupMapRepository.GetGroupMapsAsync(group.Id);
        
        foreach (var hero in heroes)
        {
            var groupMaps = await groupMapRepository.GetGroupMapsForHeroAsync(group.Id, hero.Id);
            foreach (var groupMap in groupMaps)
            {
                var location = hero.Locations.FirstOrDefault(x => x.Id == groupMap.MapAreaId);
                if (location == null)
                {
                    var newLocation = new TimerMapAreaDto
                    {
                        Id = groupMap.MapAreaId,
                        Name = groupMap.MapAreaName,
                        Maps = [new TimerMapDto
                        {
                            MapName = groupMap.MapName,
                            Updated = groupMap.Updated,
                            UpdatedBy = groupMap.UpdatedBy
                        }]
                    };
                    hero.Locations = hero.Locations.Append(newLocation);
                } else
                {
                    var newMap = new TimerMapDto
                    {
                        MapName = groupMap.MapName,
                        Updated = groupMap.Updated,
                        UpdatedBy = groupMap.UpdatedBy
                    };
                    location.Maps = location.Maps.Append(newMap);
                }
            }    
        }

        await Clients.Caller.SendAsync("GetTimers", heroes);
    }

    public async Task UpdateTimer(string mapName)
    {
        (string groupName, string serverName, AppUser user, Group group) = await ValidateData(Context);

        var groupMap = await groupMapRepository.GetGroupMapByMapNameAsync(group.Id, mapName)
            ?? throw new Exception("Map does not exist");
        
        groupMap.Updated = DateTime.UtcNow;
        groupMap.UpdatedBy = user.KnownAs;

        if (await groupRepository.Complete())
        {
            var result = new
            {
                mapName,
                updatedBy = user.KnownAs
            };
                
            await Clients.Group(groupName + "_" + serverName)
                .SendAsync("UpdateTimer", JsonSerializer.Serialize(result));
        }
    }

    private async Task<(string groupName, string serverName, AppUser user, 
        Group group)> ValidateData(HubCallerContext context)
    {
        var httpContext = context.GetHttpContext();
        var groupName = httpContext?.Request.Query["groupName"].ToString();
        var serverName = httpContext?.Request.Query["serverName"].ToString();
        if (string.IsNullOrEmpty(groupName) || string.IsNullOrEmpty(serverName) || context.User == null)
            throw new Exception("Cannot join group, did you miss group or server name?");

        var user = await userRepository.GetUserByUsernameAsync(context.User.GetUsername())
            ?? throw new Exception("User does not exist");

        var group = await groupRepository.GetGroupByGroupNameAndServerNameAsync(groupName!, serverName!) 
            ?? throw new Exception("Group does not exist");
        
        var groupMembers = await groupRepository.GetGroupMembersUsernamesAsync(group.Id);
        if (!groupMembers.Contains(user.UserName)) throw new Exception("You are not member");

        return(groupName, serverName, user, group);
    }
}
