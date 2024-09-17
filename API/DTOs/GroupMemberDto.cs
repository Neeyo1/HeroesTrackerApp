namespace API.DTOs;

public class GroupMemberDto : MemberDto
{
    //Id, Username, KnownAs
    public bool IsModerator { get; set; }
}
