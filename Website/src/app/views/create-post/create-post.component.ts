import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { bufferToggle, subscribeOn } from 'rxjs/operators';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { Post } from 'src/app/models/post.model';
import { Topic } from 'src/app/models/topic.model';
import { FileValidationService } from 'src/app/services/file-validation.service';
import { PostService } from 'src/app/services/post.service';
import { TopicService } from 'src/app/services/topic.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  pic : string;
  profileForm: FormGroup;
  change_pic: boolean;
  userID : number = this.user_svc.GetCurrentUserID()!;
  topics : number[] = [];
  t_names : string[] = [];
  imageChangedEvent : any = '';
  imageName : string = '';
  isArticle:boolean = true;
  bgColor = '#212120'


  constructor(public postSvc: PostService,
              private user_svc : UserService, 
              private router : Router,
              private topic_svc : TopicService,
              private validate : FileValidationService) { }
  

  ngOnInit(): void 
  {
    this.GetTopicList();
  }

  async GetTopicList()
  {
    await this.topic_svc.GetAllTopics().then(
      (data:TopicResponse) =>
      {
        for(let t of data.topics)
        {
          this.t_names.push(t.topicName);
          this.topics.push(t.topicID);
        }
      },
      (error:TopicResponse) =>
      {
        console.error(error);
      }
    )
  }
  async createPost(){
    let tone = document.getElementById("tone") as HTMLSelectElement;
    let topic = document.getElementById("topic") as HTMLSelectElement;
    let title = document.getElementById("title") as HTMLInputElement;
    let body = document.getElementById("textbody") as HTMLTextAreaElement;
    
    let newPost = new Post();

    newPost.userID = this.user_svc.GetCurrentUserID()!;
    newPost.type = "Article";
    newPost.topicID = topic.value == "" ? null : Number(topic.value);
    console.log(topic.value);
    newPost.bannerImage = this.pic == '' ? null : this.pic;
    newPost.tone = (tone.value == "") ? null : tone.value;
    newPost.title = title.value;
    newPost.parentPostID = null;

    newPost.body = body.innerHTML;
  }

  toggleArti() {
    this.isArticle = true;
    // this.bgColor = '#0f123f';
  }

  toggleDisc(){
    this.isArticle = false;
    // this.bgColor = '#3a424f';
  }
  //Picture Functions
  ToggleChangePic()
  {
    this.change_pic = !this.change_pic;
    this.profileForm = new FormGroup(
      {
        picture: new FormControl('', [Validators.required])
      });
  
  }
  onSubmit()
  {
    const formData = new FormData();
    
    for(const key of Object.keys(this.profileForm.value))
    {
      const value = this.profileForm.value[key];
      if(!this.validate.validateFile(value.name))
      {
        console.error("This is not a valid file type");
        return;
      }
      formData.append(key, value);
    }
    
    this.postSvc.AddPic(this.userID, formData).then(
      (data:Post_Response) =>
      {
        this.pic = data.pic;
        this.ToggleChangePic();
      },
      error =>
      {
        console.log(error);
      }
    )
  }
  onFileChanged(event:any)
  {
    if(event.target.files.length > 0)
    {
      const file = event.target.files[0];
      this.profileForm.patchValue ({
        picture: file
      });
    }
  }
}
