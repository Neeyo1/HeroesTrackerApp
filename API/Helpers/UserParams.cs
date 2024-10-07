namespace API.Helpers;

public class UserParams : PaginationParams
{
    public string? KnownAs { get; set; }
    public string Role { get; set; } = "all";
}
