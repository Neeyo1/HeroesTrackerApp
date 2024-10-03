namespace API.Helpers;

public class GroupParams : PaginationParams
{
    public string? GroupName { get; set; }
    public string? ServerName { get; set; }
    public string? Owner { get; set; }
    public int MinMembers { get; set; } = 1;
    public int MaxMembers { get; set; } = 100;
    public string OrderBy { get; set; } = "oldest";
}
