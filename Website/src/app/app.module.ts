import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { LoginFormComponent } from './views/login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SignUpPageComponent } from './views/sign-up-page/sign-up-page.component';
import { SignUpFormComponent } from './views/sign-up-form/sign-up-form.component';
import { LandingComponent } from './views/landing/landing.component';
import { CreatePostComponent } from './views/create-post/create-post.component';
import { HomeComponent } from './views/home/home.component';
import { NavbarComponent } from './views/components/navbar/navbar.component';
import { DiscussionhubComponent } from './views/discussionhub/discussionhub.component';
import { PostScrollComponent } from './views/components/post-scroll/post-scroll.component';
import { InjectorService } from './bandaid/injector.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PostComponent } from './views/post/post.component';
import { UserSettingComponent } from './views/user-setting/user-setting.component';
import { CommentComponent } from './views/post/comment/comment.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { OwnUserProfileComponent } from './views/own-user-profile/own-user-profile.component';
import { CdkScrollable, CdkScrollableModule, ScrollDispatcher, ScrollingModule, ViewportRuler } from '@angular/cdk/scrolling';
import { CreateRebuttalComponent } from './views/create-rebuttal/create-rebuttal.component';
import { TextareaAutoresizeDirective } from './directives/textarea-autoresize.directive';
import { FooterComponent } from './views/components/footer/footer.component';
import { EditUserComponent } from './views/user-setting/component/edit-user/edit-user.component';
import { SecurityComponent } from './views/user-setting/component/security/security.component';
import { ArticlePageComponent } from './views/post/type/article-page/article-page.component';
import { DiscussionPageComponent } from './views/post/type/discussion-page/discussion-page.component';
import { RebuttalPageComponent } from './views/post/type/rebuttal-page/rebuttal-page.component';
import { CommentPageComponent } from './views/post/type/comment-page/comment-page.component';
import { EditNotificationsComponent } from './views/user-setting/component/edit-notifications/edit-notifications.component';
import { ReplyBoxComponent } from './views/post/reply-box/reply-box.component';
import { RebuttalsUserComponent } from './views/user-profile/types/rebuttals-user/rebuttals-user.component';
import { PostsUserComponent } from './views/user-profile/types/posts-user/posts-user.component';
import { CommentsUserComponent } from './views/user-profile/types/comments-user/comments-user.component';
import { RebuttalsOwnComponent } from './views/own-user-profile/types/rebuttals-own/rebuttals-own.component';
import { CommentsOwnComponent } from './views/own-user-profile/types/comments-own/comments-own.component';
import { PostsOwnComponent } from './views/own-user-profile/types/posts-own/posts-own.component';
import { ArticleCardComponent } from './views/components/post-scroll/type/article-card/article-card.component';
import { DiscussionCardComponent } from './views/components/post-scroll/type/discussion-card/discussion-card.component';
import { CommentCardComponent } from './views/components/post-scroll/type/comment-card/comment-card.component';
import { RouterModule } from '@angular/router';
import { RebuttalCardComponent } from './views/components/post-scroll/type/rebuttal-card/rebuttal-card.component';
import { DiscussionComponent } from './views/create-post/discussion/discussion.component';
import { ArticleComponent } from './views/create-post/article/article.component';
import { AreYouSureComponent } from './common/are-you-sure/are-you-sure.component';
import { MatDialogModule } from '@angular/material/dialog';
import { VerifyEmailComponent } from './views/verify-email/verify-email.component';
import { NewUserComponent } from './views/new-user/new-user.component';
import { ReportBugComponent } from './views/report-bug/report-bug.component';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TexteditorComponent } from './views/components/texteditor/texteditor.component';
import { PostbodyComponent } from './views/post/postbody/postbody.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TestComponent } from './views/test/test.component';
import { SurveyComponent } from './views/survey/survey.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Test2Component } from './views/test2/test2.component';
import { RebuttalLandingComponent } from './views/rebuttal-landing/rebuttal-landing.component';
import { MessageLandingComponent } from './views/message-landing/message-landing.component';
import { SearchScrollComponent } from './views/components/search-scroll/search-scroll.component';
import { UserCardComponent } from './views/components/search-scroll/user-card/user-card.component';
import { PostSearchCardComponent } from './views/components/search-scroll/post-search-card/post-search-card.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SearchPageComponent } from './views/search-page/search-page.component';

import { ExampleComponent } from './example/example.component';
import { QuillModule } from 'ngx-quill';
import { TempcreatepostComponent } from './tempcreatepost/tempcreatepost.component';
import { ProfileComponent } from './views/user-setting/component/profile/profile.component';
import { GaugeModule } from 'angular-gauge';
import { BipartisanMenuComponent } from './views/components/bipartisan-menu/bipartisan-menu.component';
import { PreviewpageComponent } from './views/previewpage/previewpage.component';
import { FollowerBipartMenuComponent } from './views/components/follower-bipart-menu/follower-bipart-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginFormComponent,
    SignUpPageComponent,
    SignUpFormComponent,
    LandingComponent,
    CreatePostComponent,
    HomeComponent,
    NavbarComponent,
    DiscussionhubComponent,
    PostScrollComponent,
    PostComponent,
    UserSettingComponent,
    CommentComponent,
    UserProfileComponent,
    OwnUserProfileComponent,
    CreateRebuttalComponent,
    ArticlePageComponent,
    DiscussionPageComponent,
    RebuttalPageComponent,
    CommentPageComponent,
    EditUserComponent,
    EditNotificationsComponent,
    SecurityComponent,
    ReplyBoxComponent,
    RebuttalsUserComponent,
    PostsUserComponent,
    CommentsUserComponent,
    RebuttalsOwnComponent,
    CommentsOwnComponent,
    PostsOwnComponent,
    ArticleCardComponent,
    DiscussionCardComponent,
    CommentCardComponent,
    TextareaAutoresizeDirective,
    FooterComponent,
    EditUserComponent,
    SecurityComponent,
    DiscussionCardComponent,
    RebuttalCardComponent,
    SecurityComponent,
    DiscussionComponent,
    ArticleComponent,
    AreYouSureComponent,
    VerifyEmailComponent,
    NewUserComponent,
    ReportBugComponent,
    TexteditorComponent,
    PostbodyComponent,
    SafeHtmlPipe,
    TestComponent,
    SurveyComponent,
    Test2Component,
    RebuttalLandingComponent,
    MessageLandingComponent,
    SearchScrollComponent,
    UserCardComponent,
    PostSearchCardComponent,
    SearchPageComponent,
    ProfileComponent,
    BipartisanMenuComponent,
    PreviewpageComponent,
    FooterComponent,
    FollowerBipartMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatDialogModule,
    CKEditorModule,
    Ng2SearchPipeModule,
    ImageCropperModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean']
        ]
      }
    }),
    GaugeModule.forRoot()
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : InjectorService,
      multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }