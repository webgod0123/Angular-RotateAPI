import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { Post } from 'src/app/models/post.model';
import { Topic } from 'src/app/models/topic.model';
import { User } from 'src/app/models/user.model';
import { ProfileService } from 'src/app/services/profile.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureComponent } from 'src/app/common/are-you-sure/are-you-sure.component';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-rebuttal-card',
  templateUrl: './rebuttal-card.component.html',
  styleUrls: ['./rebuttal-card.component.css'],
  animations:[
    trigger('cardFlip', [
      state('false', style({
        transform: 'none'
      })),
      state('true', style({
        transform: 'rotateY(360deg)'
      })),
      transition('false => true', [
        animate('800ms')
      ]),
      transition('true => false', [
        animate('1000ms')
      ]),
      
    ])
  ]
})
export class RebuttalCardComponent implements OnInit {

  ngOnInit(){
    
  }

  // own_post : boolean = false;
  // router_url : string = '';
  // loading : boolean = true;
  // newDate: string;
  // image_url : string = '';
  // delete : boolean;
  // dialog: any;

  // constructor(private userSvc: UserService, 
  //             private topic_svc : TopicService,
  //             private profile_svc : ProfileService,
  //             private post_svc : PostService) { }
  //             ) { }

  
  @Input() item: Post;
  @Input() topic : Topic;
  @Input() user : User = {} as User;
  
  // parent : Post;
  // show_og_post : boolean
  // // async ngOnInit()
  // // {
  // //   await this.post_svc.GetPost(this.item.parentPostID!).then(
  // //     (data:Post_Response) =>
  // //     {
  // //       this.parent = data.post;
  // //       this.InitCont()
  // //     }
  // //   )
    
  // // } // end init
  // InitCont()
  // {

  // async ngOnInit()
  // {
    
  //   this.loading = true;
  //   if(this.item.bannerImage != null)
  //   {
  //     this.image_url = this.item.bannerImage;
  //   }
  //   else
  //   {
  //     this.GetProfilePic();
  //   }
  //   if(this.user.userID == this.userSvc.GetCurrentUserID()!)
  //   {
  //     this.own_post = true;
  //     this.router_url = '/profile';
  //   }
  //   else
  //   {
  //     this.router_url = '/u/' + this.user.username;
  //   }
  //   this.newDate = this.formatDate(this.item.timestamp);

  //   console.log();
  //   this.loading = false;

  //   this.newDate = this.formatDate(this.item.timestamp);
  // }
  // } // end init

  // async GetProfilePic()
  // {
  //   await this.profile_svc.GetProfile(this.user.userID).then(
  //     (data:ProfileResponse) =>
  //     {
  //       this.image_url = data.profile.profilePic;
  //     },
  //     (error:ProfileResponse) =>
  //     {
  //       console.error(error);
  //     }
  //   )
  // }
  //  formatDate(date:Date)
  //  {
  //    //var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  //    return new Date(date).toLocaleDateString("en-US"); 
  //  }
  // DeletePost()
  // {
  //     const dialogRef = this.dialog.open(AreYouSureComponent, {
  //       width: '250px',
  //     });
  
  //     dialogRef.afterClosed().subscribe((result: boolean) => {
  //       console.log('The dialog was closed');
  //       this.delete = result;
  //       this.ContDeletePost();
  //     });
  // }
  // ContDeletePost()
  // {
  //   if(this.delete)
  //   {
  //     this.post_svc.DeletePost(this.item.postID);   
  //   }
  // }
  // ToggleShowOG()
  // {
  //   this.show_og_post = !this.show_og_post
  //   var temp = this.item;
  //   this.item = this.parent;
  //   this.parent = temp;
  //   this.InitCont();
  // }
}

