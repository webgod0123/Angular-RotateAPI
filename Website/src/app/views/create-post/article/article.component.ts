import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileResponse } from 'src/app/models/DTOs/Responses/profileresponse.model';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UserService } from 'src/app/services/user.service';
import { Profile } from 'src/app/models/profile.model';
import { TopicService } from 'src/app/services/topic.service';
import { TopicResponse } from 'src/app/models/DTOs/Responses/topic-response.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post_Response } from 'src/app/models/DTOs/Responses/post_response.model';
import { FileValidationService } from 'src/app/services/file-validation.service';
import { environment } from 'src/environments/environment';
import Quill from 'quill';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  data: any = `<p>Hello, world!</p>`;
  retrieveddata: string = this.data;
  name = "Angular";


  title: string;
  body: string;


user_id :number = this.user_svc.GetCurrentUserID()!;


  editor= new Quill('#quillEditor');
  justHtml: string = "";

  activetone: string = "";

  pic : string;
  profileForm: FormGroup;
  change_pic: boolean;
  userID : number = this.user_svc.GetCurrentUserID()!;
  topics : number[] = [];
  t_names : string[] = [];

  isArticle:boolean = true;
  bgColor = '#212120'
  profile: Profile;

  items = [];
  imageChangedEvent: string = '';
  imageName: any;

  previewOn:boolean = false;

  addItem(newItem: string) {
    // this.items.push(newItem);
    return newItem;
  }

  constructor(public postSvc: PostService,
              private user_svc : UserService, 
              private router : Router,
              private topic_svc: TopicService,
              private profile_svc: ProfileService,
              private validate: FileValidationService) { }


    editorForm: FormGroup
    editorContent: string;

  ngOnInit(): void {
    this.GetTopicList();
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    })
    this.profileForm = new FormGroup(
      {
        picture: new FormControl('', [Validators.required])
      });
  }

  previewToggle(){

    if(this.previewOn == false){

    let temp = document.getElementById("title") as HTMLInputElement;
    let temp2 = this.editorForm.get('editor')?.value;

    this.title = temp.value;
    this.body = temp2;
  }

    console.log("i am clicked");
    this.previewOn = !this.previewOn;
    
  }
   //Picture Functions
   ExitCropping()
   {
     this.imageChangedEvent = '';
   }
   onFileChanged(event:any)
   {
     if(event.target.files.length > 0)
     {
       const file = event.target.files[0];
       if(!this.validate.validateFile(file.name))
       {
         console.error("This is not a valid file type");
         return;
       }
       this.profileForm.patchValue ({
         picture: file
       });
       this.imageName = file.name;
     }
     this.imageChangedEvent = event;
   }
  imageCropped(event : ImageCroppedEvent)
  {
    var blob : BlobPart[] = [];
    console.log(base64ToFile(event.base64!));
    blob.push(base64ToFile(event.base64!));
    var file : File = new File(blob, this.imageName);
    this.profileForm.patchValue({
      picture: file
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
        console.log(data);
        this.pic = data.pic
        this.imageChangedEvent='';
      },
      error =>
      {
        console.log(error);
      }
    )
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

  changed(event:any) {
    this.justHtml = this.editor.root.innerHTML;
  }

  async createPost(){


    let topic = document.getElementById("multi-select") as HTMLSelectElement;
    let title = document.getElementById("title") as HTMLInputElement;
    let body = this.editorForm.get('editor')?.value;

    let newPost = new Post();

    newPost.userID = this.user_svc.GetCurrentUserID()!;
    newPost.type = "Article";
    newPost.topicID = (topic.value == "") ? null : Number.parseInt(topic.value);

    newPost.tone = (this.activetone == "") ? null : this.activetone;
    newPost.title = title.value;
    newPost.parentPostID = null;
    newPost.bannerImage = (this.pic == environment.def_createbannerpic) ? null : this.pic;
    newPost.body = body;


    this.profile_svc.GetProfile(newPost.userID).then(
      (data:ProfileResponse) => {
          this.profile = data.profile
        });

    this.postSvc.CreatePost(newPost).catch(err=>{
      console.error(err);
    });


    this.router.navigate(['/home']);
  }

  onbSubmit() {
    this.editorContent = this.editorForm.get('editor')?.value;
  }

  // maxLength(e) {
  //   if (e.editor.getLength() > 10) {
  //     e.editor.deleteText(10, e.editor.getLength());
  //   }
  // }

  disp() {
    this.editor.root.innerHTML;
  }

  

  removeColors() {
    document.getElementById("serious")!.style.backgroundColor = 'transparent';
    document.getElementById("funny")!.style.backgroundColor = 'transparent';
    document.getElementById("formal")!.style.backgroundColor = 'transparent';
    document.getElementById("informal")!.style.backgroundColor = 'transparent';
    document.getElementById("serious")!.style.color = 'black';
    document.getElementById("funny")!.style.color = 'black';
    document.getElementById("formal")!.style.color = 'black';
    document.getElementById("informal")!.style.color = 'black';
  }

  setSerious(){
    this.activetone = "serious";
    this.removeColors();
    document.getElementById("serious")!.style.backgroundColor = '#3b5999'
    document.getElementById("serious")!.style.color = 'white';

  }

  setFunny(){
    this.activetone = "serious";
    this.removeColors();
    document.getElementById("funny")!.style.backgroundColor = '#46c1f6'
    document.getElementById("funny")!.style.color = 'white';
  }

  setFormal() {
    this.activetone = "serious";
    this.removeColors();
    document.getElementById("formal")!.style.backgroundColor = '#e1306c'
    document.getElementById("formal")!.style.color = 'white';
  }

  setInformal(){
    this.activetone = "serious";
    this.removeColors();
    document.getElementById("informal")!.style.backgroundColor = '#de463b'
    document.getElementById("informal")!.style.color = 'white';
  }
}
