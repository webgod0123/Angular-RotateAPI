import { Post_Node } from "../../Lists/post_node.model";
import { Post } from "../../post.model";

export class Post_Response
{
    post : Post;
    postList : Post[];
    pic : string;
    errors : string[];
    success : boolean;
}