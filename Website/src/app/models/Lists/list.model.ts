import { Post } from "../post.model";
import { Post_Node } from "./post_node.model";

export abstract class List
{
    public abstract first : Post_Node | null;
    public abstract last : Post_Node | null;
    
    public abstract Insert (node : Post) : void; // needs to be O(1)
    public abstract Pop () : Post | null; // ideally O(n)
}