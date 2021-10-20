
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post_Response } from '../models/DTOs/Responses/post_response.model';
import { UserTopicResponse } from '../models/DTOs/Responses/usertopicresponse.model';
import { Post } from '../models/post.model'

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  //URLs
  readonly addPost : string = environment.BASE_URL + '/api/v1/add-post'
  readonly getPost : string = environment.BASE_URL + '/api/v1/get-post/'
  readonly getPostTopic : string = environment.BASE_URL + '/api/v1/get-posts-topic-id/'
  readonly getPostUser : string = environment.BASE_URL + '/api/v1/get-posts-user-id/'
  readonly getPostType : string = environment.BASE_URL + '/api/v1/get-posts-type/'
  readonly getPostUserAndType : string = environment.BASE_URL + '/api/v1/get-posts-user-id-and-type/'
  readonly getPostTopicType : string = environment.BASE_URL + '/api/v1/get-posts-topic-id-and-type/'
  readonly getAllPosts : string = environment.BASE_URL + '/api/v1/get-all-post-ids';
  readonly getComments : string = environment.BASE_URL + '/api/v1/get-comments/';
  readonly updatePost : string = environment.BASE_URL + '/api/v1/update-post/';
  readonly postPic : string = environment.BASE_URL + '/api/v1/add-post-pic/';
  readonly deletePost = environment.BASE_URL + '/api/v1/delete-post/';

  authToken = localStorage.getItem('authtoken');

  async CreatePost(post : Post) : Promise<Post_Response>
  {
    return await this.http.post<Post_Response>(this.addPost, post, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)})
      .pipe(take(1))
      .toPromise();
  }
  async UpdatePost(id : string, patch : any) : Promise<Post_Response>
  {
    return await this.http.patch<Post_Response>(this.updatePost + id, patch)
      .pipe(take(1))
      .toPromise();
  }

  //TODO return this to it's new version. 
  GetPostIds(): Observable<Post_Response> {
    return this.http.get<Post_Response>(this.getAllPosts);
  }

  async GetPost (id : string) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getPost + id)
      .pipe(take(1))
      .toPromise();   
  }
  async GetPostsTopicID (id : number) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getPostTopic + id)
      .pipe(take(1))
      .toPromise();
  }
  async GetPostsUserID (id: number) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getPostUser + id, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)})
      .pipe(take(1))
      .toPromise();
  }
  async GetPostsType(type : string) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getPostType + type, 
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)})
      .pipe(take(1))
      .toPromise();
  }
  async GetPostsUserAndType(id : string) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getPostUserAndType + id,
      {headers: new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`)})
      .pipe(take(1))
      .toPromise();
  }
  async GetPostsTopicAndType(id : string) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getPostTopicType + id)
      .pipe(take(1))
      .toPromise();
  }
  async GetComments (id:string) : Promise<Post_Response>
  {
    return await this.http.get<Post_Response>(this.getComments + id)
      .pipe(take(1))
      .toPromise();
  }
  async AddPic(id:number, body:any) : Promise<Post_Response>
  {
    return await this.http.put<Post_Response>(this.postPic + id, body)
      .pipe(take(1))
      .toPromise();
  }
  async DeletePost(id : string) : Promise<Post_Response>
  {
    return await this.http.delete<Post_Response>(this.deletePost + id)
      .pipe(take(1))
      .toPromise();
  }
}

