using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

[Authorize]
public class TimerHub(IGroupRepository groupRepository, IUserRepository userRepository,
    IGroupMapRepository groupMapRepository) : Hub
{
    public override async Task OnConnectedAsync()
    {
        (string groupName, string serverName, AppUser user, Group group) = await ValidateData(Context);

        await Groups.AddToGroupAsync(Context.ConnectionId, groupName + "_" + serverName);

        //await Clients.Group(groupName + "_" + serverName).SendAsync("NewMessage", "TestMessage");
        await Clients.Caller.SendAsync("NewMessage", "TestMessage");
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    public async Task GetTimers()
    {
        (string groupName, string serverName, AppUser user, Group group) = await ValidateData(Context);

        var groupMaps = await groupMapRepository.GetGroupMapsAsync(group.Id);

        await Clients.Group(groupName + "_" + serverName).SendAsync("GetTimers", groupMaps);
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
