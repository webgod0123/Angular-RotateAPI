import { Topic } from "../../topic.model";

export class TopicResponse 
{
    errors : string[];
    success : boolean;
    topic : Topic;
    topics : Topic[];
}
