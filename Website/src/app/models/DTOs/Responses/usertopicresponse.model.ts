import { UserTopics } from "../Requests/usertopic.model";

export class UserTopicResponse
{
    relationship : UserTopics;
    topicList : number[];
    userList: number[];
    followed : boolean;
    success : boolean;
    errors : string[];
}