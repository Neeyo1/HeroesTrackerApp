namespace API.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string KnownAs { get; set; }
    public required string Token { get; set; }
}