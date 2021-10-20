import { DomElementSchemaRegistry } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/bandaid/navigation.service';
import { AreYouSureComponent } from 'src/app/common/are-you-sure/are-you-sure.component';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { Interaction } from 'src/app/models/DTOs/Responses/interaction.model';
import { InteractionResponse } from 'src/app/models/DTOs/Responses/interactionresponse.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { Profile } from 'src/app/models/profile.model';
import { User } from 'src/app/models/user.model';
import { InteractionService } from 'src/app/services/interaction.service';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comment-page',
  templateUrl: './comment-page.component.html',
  styleUrls: ['./comment-page.component.css']
})
export class CommentPageComponent implements OnInit {

  reply : boolean = false;
  user_id : number | null = this.user_svc.GetCurrentUserID();
  text : string = "";
  user: User;
  loading: boolean = false;
  delete: any;

  constructor(private post_svc : PostService, 
              private user_svc : UserService,
              private navigation : NavigationService,
              private profile_svc : ProfileService,
              private dialog : MatDialog,
              private interact_svc : InteractionService,
              private router : Router) { }

  @Input() item: Post;
  @Input() iteration:number;

  profile : Profile;
  comments : Timestamp_List = new Timestamp_List();
  display_comments : Post[] = [];

  blocked_id_list : number[] = [];
  
  agree : Interaction | null; //type = 0
  disagree : Interaction | null; //type = 1
  thoughtful : Interaction | null; //type = 2

  total_count : number = 0;

  async ngOnInit()
  {
    if(this.user_id)
    {
      await this.GetBlockedList();
    }
    await this.GetComments();
    this.DisplayComments(2);
    if(this.item.userID != -1)
    {
      await this.GetUsername();
    }
    else
    {
      this.user = new User();
      this.profile = new Profile();
      this.user.username = "[redacted]"
      this.user.displayName = "[redacted]"
      this.profile.profilePic = environment.BASE_URL_BLOB + environment.default_pic;
    }
    this.loading = true; 
  }
  async InitializeInteractions()
  {
    
    await this.interact_svc.GetInteractions(this.item.postID, this.user_id!).then(
      (data:InteractionResponse) =>
      {
        for(let i of data.interactions)
        {
          this.SetType(i, i.type);
        }
      },
      (error:InteractionResponse) =>
      {
        console.error(error);
      }
    )
    await this.InteractionCounts();
  }
  async InteractionCounts()
  {
    this.total_count = 0;
    await this.interact_svc.GetCount(this.item.postID, 0).then(
      (data:InteractionResponse) =>
      {
        this.total_count += data.count;
      },
      (error:InteractionResponse) =>
      {
        console.error(error);
      }
    )
    await this.interact_svc.GetCount(this.item.postID, 1).then(
      (data:InteractionResponse) =>
      {
        this.total_count -= data.count;
      },
      (error:InteractionResponse) =>
      {
        console.error(error);
      }
    )
  }
  async GetBlockedList()
  {
    await this.user_svc.GetAllBlockedUsers(this.user_id!).then(
      (data:BlockedResponse) => 
      {
        for(let u of data.blockedUsers)
        {
          this.blocked_id_list.push(u.userID);
        }
      }
    )
  }
  async GetUsername(){
    await this.user_svc.GetUser(this.item.userID).then(
      (data:User_Response) => {
        this.user = data.user;
      },
      (error:User_Response) =>
      {
        console.error(error);
      }
    )
    await this.profile_svc.GetProfile(this.item.userID).then(
      (data:ProfileResponse) =>
      {
        this.profile = data.profile;
        if(this.blocked_id_list.indexOf(this.profile.userID) != -1)
        {
          this.profile.profilePic = environment.default_pic;
        }
      }
    )
  }
  async GetComments()
  {
    await this.post_svc.GetComments(this.item.postID).then(
      (data:Post_Response) =>
      {
        if(!data.success)
        {
          console.error(data);
          return;
        }
        for(let item of data.postList)
        {
          for(let id of this.blocked_id_list)
          {
            if(item.userID == id)
            {
              item.body = "You cannot view this post for various reasons."
              item.userID = -1;
            }
          }
          if(item.delete)
          {
            item.body = "You cannot view this post for various reasons.";
            item.userID = -1;
          }
          this.comments.Insert(item);
        }
      },
      (error:Post_Response) =>
      {
        console.error(error);
      }
    )
  }
  DisplayComments(iter : number)
  {
    if(this.comments.first == null || this.iteration >= 8)
    {
      return;
    }
    for(var i = 0; i <= iter; i++)
    {
      if(this.comments.first  == null)
      {
        return;
      }
      this.display_comments.push(this.comments.Pop()!);
    }
  }
  public ReplyToggle()
  {
    this.reply = !this.reply;
  }
  Back()
  {
    this.navigation.back()
  }
  DeletePost()
  {
      const dialogRef = this.dialog.open(AreYouSureComponent, {
        width: '250px',
        data: "delete this post?"
      });
  
      dialogRef.afterClosed().subscribe(
        async result => {
        console.log('The dialog was closed');
        this.delete = result;
        await this.ContDeletePost();
      });
  }
  async ContDeletePost()
  {
    if(this.delete)
    {
      await this.post_svc.DeletePost(this.item.postID).then(
        (data:Post_Response) =>
        {
          
        },
        (error:Post_Response) =>
        {
          console.error(error);
        }
      )
      location.reload();
    }
  }
  async Interact(type : number)
  {
    var obj  = new Interaction();
    obj.postID = this.item.postID;
    obj.userID = this.user_id!;
    obj.type = type;
    if(type == 0 && this.disagree)
    {
      
      await this.RemoveInteraction(this.disagree);
      await this.interact_svc.AddInteraction(obj).then(
        async (data:InteractionResponse) =>
        {
          this.SetType(data.interaction, type);
          this.InteractionCounts();
          return;
        },
        (error:InteractionResponse) =>
        {
          console.error(error);
          return;
        }
      )
      return;
    }
    else if(type == 1 && this.agree)
    {
      await this.RemoveInteraction(this.agree);
      await this.interact_svc.AddInteraction(obj).then(
        async (data:InteractionResponse) =>
        {
          this.SetType(data.interaction, type);
          this.InteractionCounts();
          return;
        },
        (error:InteractionResponse) =>
        {
          console.error(error);
          return;
        }
      )
      return;
    }
    await this.interact_svc.AddInteraction(obj).then(
      async (data:InteractionResponse) =>
      {
        this.SetType(data.interaction, type);
        await this.InteractionCounts();
        return;
      },
      (error:InteractionResponse) =>
      {
        console.error(error);
        return;
      }
    )
  }
  SetType(obj : Interaction | null, type:number)
  {
    switch(type)
    {
      case 0:
        this.agree = obj;
      break;
      case 1:
        this.disagree = obj;
      break;
      case 2:
        this.thoughtful = obj;
      break;
    }
  }
  async RemoveInteraction(obj : Interaction)
  {
    if(obj == null)
    {
      return;
    }
    await this.interact_svc.RemoveInteraction(obj.interactionID).then(
      async (data:InteractionResponse) =>
      {
        this.SetType(null, obj.type);
        await this.InteractionCounts();
      },
      (error:InteractionResponse) =>
      {
        console.error(error);
      }
    )
  }
  RouteToProfile()
  {
    if(this.user.userID == -1)
    {
      return;
    }

    if(this.user.userID == this.user_id)
    {
      this.router.navigate(['/profile'])
    }
    else
    {
      this.router.navigate(['/u/' + this.user.username]);
    }
  }
}
