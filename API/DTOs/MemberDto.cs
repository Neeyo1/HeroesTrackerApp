namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string KnownAs { get; set; }
}
