namespace API.DTOs;

public class MemberWithRolesDto
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? KnownAs { get; set; }
    public List<string> Roles { get; set; } = [];
}
