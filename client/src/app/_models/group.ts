import { GroupMember } from "./groupMember";
import { Member } from "./member"

export interface Group {
    id: number;
    groupName: string;
    serverName: string;
    createdAt: Date;
    membersCount: number;
    owner: Member;
    members: GroupMember[];
}