import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/bandaid/navigation.service';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { Interaction } from 'src/app/models/DTOs/Responses/interaction.model';
import { InteractionResponse } from 'src/app/models/DTOs/Responses/interactionresponse.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
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
  selector: 'app-previewpage',
  templateUrl: './previewpage.component.html',
  styleUrls: ['./previewpage.component.css']
})
export class PreviewpageComponent implements OnInit {
  
  reply: string = '';

  // @ViewChild('content', { static: false }) divContent: ElementRef;


  constructor(
              private post_svc:PostService,
              private navigation:NavigationService,
              private user_svc : UserService,
              private profile_svc : ProfileService,
              private interact_svc : InteractionService,
              private router:Router) { }

  @Input() user:User;
  // @Input() profile:Profile;
  
  @Input() title:string;
  @Input() body:string;


  user_id :number = this.user_svc.GetCurrentUserID()!;

  comments : Timestamp_List = new Timestamp_List();
  display_comments : Post[] = [];

  notScrollingY: boolean = true;
  notEmptyComments: boolean = true;
  loading : boolean = true;

  blocked_id_list: number[] = [];
  
  agree : Interaction | null; //type = 0
  disagree : Interaction | null; //type = 1
  thoughtful : Interaction | null; //type = 2

  total_count : number = 0;
  async ngOnInit() 
  {
    // this.renderer.setProperty(this.divContent.nativeElement,'innerHTML', 'item.body')
    if(this.user_svc.GetCurrentUserID() != null)
    { 
      await this.GetBlockedList();
    }

    for(var i = 0; i < 6; i++)
    {
      this.LoadNextComment();
    }
    this.loading = false;
  }



  async GetBlockedList()
  {
    await this.user_svc.GetAllBlockedUsers(this.user_svc.GetCurrentUserID()!).then(
      (data:BlockedResponse) => 
      {
        for(let u of data.blockedUsers)
        {
          this.blocked_id_list.push(u.userID);
        }
      },
      (error:BlockedResponse) =>
      {
        console.error(error);
      }
    )
  }
  
  OnScroll()
  {
    if(this.comments.first == null)
    {
      this.notEmptyComments = true;
    }
    if(this.notScrollingY && this.notEmptyComments)
    {
      this.notScrollingY = false;
      this.LoadNextComment();
    }
  } // end function
  LoadNextComment()
  {
    if(this.comments.first == null)
    {
      this.notEmptyComments = false;
      return;
    }
    this.AddCommentToArray(this.comments.Pop()!);
  } // end function
  AddCommentToArray(post : Post)
  {
      this.notScrollingY = true;
      this.display_comments.push(post);
  } // end function

  async GetComments(id : string)
  {
    return this.post_svc.GetComments(id).then(
      (data:Post_Response) =>
      {
        if(!data.success)
        {
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
    );
  }
  Back()
  {
    this.navigation.back();
  }
  async Interact(type : number)
  {
    var obj  = new Interaction();
    obj.userID = this.user_id;
    obj.type = type;
    if(type == 0 && this.disagree)
    {
      await this.RemoveInteraction(this.disagree);
      await this.interact_svc.AddInteraction(obj).then(
        async (data:InteractionResponse) =>
        {
          this.SetType(data.interaction, type);
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
      },
      (error:InteractionResponse) =>
      {
        console.error(error);
      }
    )
  }
  RouteProfile()
  {
    if(this.user.userID == this.user_id)
    {
      this.router.navigate(['/profile'])
    }
    else
    {
      this.router.navigate(['/u/' + this.user.username])
    }
  }
  editorForm: any;

}
