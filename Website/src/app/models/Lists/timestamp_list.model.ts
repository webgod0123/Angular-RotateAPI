
import { Post } from "../post.model";
import { List } from "./list.model";
import { Post_Node } from "./post_node.model";

export class Timestamp_List extends List
{
    first : Post_Node | null;
    last : Post_Node | null;

    public Insert (post : Post) : void
    {
        
        var node : Post_Node = new Post_Node();
        node.post = post;
        if(this.first == null)
        {
            this.first = node;
        }
        else
        {
            this.last!.next = node;
            node.previous = this.last;
        }
        this.last = node;
    }
    public Pop() : Post | null
    {
        if(this.first == null)
        {
            return null;
        }
        
        var current_node : Post_Node = this.last!;
        var prev_node : Post_Node | null = current_node.previous;
        while(prev_node)
        {
            
            if(current_node.post.postID == prev_node.post.postID)
            {
                if(current_node.next)
                {
                    current_node.next.previous = current_node.previous;
                    current_node.next = current_node.next;
                }
                else
                {
                    current_node.previous!.next = null;
                    this.last = current_node.previous!;
                }
                current_node = current_node.previous!;
            }
            if(current_node.post.timestamp < prev_node.post.timestamp)
            {
                current_node = prev_node;
            }
            prev_node = prev_node.previous;
        }
        if(current_node == this.last && current_node == this.first)
        {
            this.last = null;
            this.first = null;
        }
        else if (current_node == this.last)
        {
            this.last = current_node.previous!;
            this.last.next == null;
        }
        else if (current_node == this.first)
        {
            this.first = current_node.next!;
            this.first.previous = null;
        }
        else
        {
            current_node.next!.previous = current_node.previous;
            current_node.previous!.next = current_node.next;
        }
        return current_node.post;
    }
}