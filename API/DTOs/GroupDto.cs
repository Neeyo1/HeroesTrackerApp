namespace API.DTOs;

public class GroupDto
{
    public int Id { get; set; }
    public required string GroupName { get; set; }
    public required string ServerName { get; set; }
    public DateTime CreatedAt { get; set; }
    public int MembersCount { get; set; }
    public MemberDto Owner { get; set; } = null!;
}
