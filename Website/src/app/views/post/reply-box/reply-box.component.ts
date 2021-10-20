import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reply-box',
  templateUrl: './reply-box.component.html',
  styleUrls: ['./reply-box.component.css']
})
export class ReplyBoxComponent implements OnInit {
  
  reply: string;
  user_id : number | null=  this.user_svc.GetCurrentUserID();
  @Input() item: Post;

  constructor(private post_svc : PostService,
              private user_svc : UserService) { }

  ngOnInit(): void 
  {
    
  }
  Comment(form:NgForm)
  {
    var new_comment : Post = new Post();
    new_comment.body = this.reply;
    new_comment.parentPostID = this.item.postID;
    if(this.item.alphaPostID != null)
    {
      new_comment.alphaPostID = this.item.alphaPostID;
    }
    else
    {
      new_comment.alphaPostID = this.item.postID;
    }
    new_comment.type = "Comment";
    new_comment.userID = this.user_id!;
    this.post_svc.CreatePost(new_comment).then(
      (data:Post_Response) =>
      {
        form.form.reset();
        this.reply = '';
        console.log(data);
        location.reload();
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    );
  }
}
