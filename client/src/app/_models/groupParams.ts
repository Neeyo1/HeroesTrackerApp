export class GroupParams{
    groupName?: string;
    serverName?: string;
    owner?: string;
    minMembers = 1;
    maxMembers = 100;
    orderBy = "oldest";
    pageNumber = 1;
    pageSize = 3;
}