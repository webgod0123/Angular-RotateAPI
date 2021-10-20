import { Component, Input, OnInit, ViewChild, Renderer2, AfterViewInit, ElementRef, ViewEncapsulation, Pipe, PipeTransform} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationService } from 'src/app/bandaid/navigation.service';
import { BlockedResponse } from 'src/app/models/DTOs/Responses/blockedresponse.model';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { Timestamp_List } from 'src/app/models/Lists/timestamp_list.model';
import { Post } from 'src/app/models/post.model';
import { Profile } from 'src/app/models/profile.model';
import { User } from 'src/app/models/user.model';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from 'src/app/pipes/safe-html.pipe';
import { InteractionService } from 'src/app/services/interaction.service';
import { Interaction } from 'src/app/models/DTOs/Responses/interaction.model';
import { InteractionResponse } from 'src/app/models/DTOs/Responses/interactionresponse.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rebuttal-page',
  templateUrl: './rebuttal-page.component.html',
  styleUrls: ['./rebuttal-page.component.css']
})
export class RebuttalPageComponent implements OnInit {
  reply: string = '';

  // @ViewChild('content', { static: false }) divContent: ElementRef;


  constructor(private spinner:NgxSpinnerService,
              private post_svc:PostService,
              private navigation:NavigationService,
              private user_svc : UserService,
              private profile_svc : ProfileService,
              private renderer: Renderer2,
              private el: ElementRef,
              private interact_svc : InteractionService,
              private router:Router) { }

  @Input() item:Post;
  @Input() user:User;
  @Input() profile:Profile;

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
    await this.GetProf();
    await this.GetComments(this.item.postID);

    for(var i = 0; i < 6; i++)
    {
      this.LoadNextComment();
    }
    this.InitializeInteractions();
    this.loading = false;
  }
  async InitializeInteractions()
  {
    
    await this.interact_svc.GetInteractions(this.item.postID, this.user_id).then(
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
    await this.interact_svc.GetCount(this.item.postID, 0).then(
      (data:InteractionResponse) =>
      {
        this.total_count = 0;
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
  async GetProf()
  {
    await this.profile_svc.GetProfile(this.user.userID).then(
      (data:ProfileResponse) =>
      {
        this.profile = data.profile
        if(this.blocked_id_list.indexOf(this.profile.userID) != -1)
        {
          this.profile.profilePic = environment.default_pic;
        }
      },
      (error:ProfileResponse) =>
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
      this.spinner.show();
      this.notScrollingY = false;
      this.LoadNextComment();
    }
  } // end function
  LoadNextComment()
  {
    if(this.comments.first == null)
    {
      this.notEmptyComments = false;
      this.spinner.hide();
      return;
    }
    this.AddCommentToArray(this.comments.Pop()!);
  } // end function
  AddCommentToArray(post : Post)
  {
      this.spinner.hide();
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
    obj.postID = this.item.postID;
    obj.userID = this.user_id;
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
        console.log(data);
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
}
