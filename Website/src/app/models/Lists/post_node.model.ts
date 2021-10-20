import { Post } from "../post.model";

export class Post_Node
{
    post : Post;
    previous : Post_Node | null;
    next : Post_Node | null;
}