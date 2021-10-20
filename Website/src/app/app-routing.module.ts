import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './views/post/post.component';
import { PostScrollComponent } from './views/components/post-scroll/post-scroll.component';
import { CreatePostComponent } from './views/create-post/create-post.component';
import { HomeComponent } from './views/home/home.component';
import { LandingComponent } from './views/landing/landing.component';
import { LoginFormComponent } from './views/login-form/login-form.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { SignUpPageComponent } from './views/sign-up-page/sign-up-page.component';
import { UserSettingComponent } from './views/user-setting/user-setting.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { OwnUserProfileComponent } from './views/own-user-profile/own-user-profile.component';
import { CreateRebuttalComponent } from './views/create-rebuttal/create-rebuttal.component';
import { DiscussionhubComponent } from './views/discussionhub/discussionhub.component';
import { RebuttalCardComponent } from './views/components/post-scroll/type/rebuttal-card/rebuttal-card.component';
import { VerifyEmailComponent } from './views/verify-email/verify-email.component';
import { NewUserComponent } from './views/new-user/new-user.component';
import { TexteditorComponent } from './views/components/texteditor/texteditor.component';
import { ReportBugComponent } from './views/report-bug/report-bug.component';
import { TestComponent } from './views/test/test.component';
import { SurveyComponent } from './views/survey/survey.component';
import { Test2Component } from './views/test2/test2.component';
import { RebuttalPageComponent } from './views/post/type/rebuttal-page/rebuttal-page.component';
import { RebuttalLandingComponent } from './views/rebuttal-landing/rebuttal-landing.component';
import { MessageLandingComponent } from './views/message-landing/message-landing.component';
import { UserCardComponent } from './views/components/user-card/user-card.component';
import { SearchPageComponent } from './views/search-page/search-page.component';
import { ExampleComponent } from './example/example.component';
import { TempcreatepostComponent } from './tempcreatepost/tempcreatepost.component';
import { ArticleCardComponent } from './views/components/post-scroll/type/article-card/article-card.component';
import { DiscussionCardComponent } from './views/components/post-scroll/type/discussion-card/discussion-card.component';
import { ArticleComponent } from './views/create-post/article/article.component';
import { DiscussionComponent } from './views/create-post/discussion/discussion.component';
import { PreviewpageComponent } from './views/previewpage/previewpage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignUpPageComponent
  },
  {
    path: 'createpost',
    component: CreatePostComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    runGuardsAndResolvers: "paramsChange"
  },
  {
    path: 'survey',
    component: SurveyComponent
  },
  {
    path: 'test2',
    component: TempcreatepostComponent
  },
  {
    path: 'p/:id',
    component : PostComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'settings',
    component: UserSettingComponent
  },
  {
    path: 'u/:id',
    component: UserProfileComponent
  },
  {
    path: 'profile',
    component: OwnUserProfileComponent
  },
  {
    path: 'create-rebuttal/:id',
    component: CreateRebuttalComponent
  },
  {
    path: 'discussion-hub/:id',
    component: DiscussionhubComponent
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'new-user/:id',
    component: NewUserComponent
  },
  {
    path: 'bugreport',
    component: ReportBugComponent
  },
  {
    path: 'rebuttal',
    component: RebuttalPageComponent
  },
  {
    path: 'rebuttal-landing',
    component: RebuttalLandingComponent
  },
  {
    path: 'message-landing',
    component: MessageLandingComponent
  },
  {
    path: 'usercard',
    component: UserCardComponent
  },
  {
    path: 'search/:id',
    component: SearchPageComponent,
  },
  {
    path: 'example',
    component: ExampleComponent
  },
  {
    path: 'createarticle',
    component: ArticleComponent
  },
  {
    path: 'creatediscussion',
    component: DiscussionComponent
  },
  { 
    path: 'previewpage',
    component: PreviewpageComponent
  },
  {
    path: 'createrebuttal',
    component: CreateRebuttalComponent
  },
  {
    path: 'rebuttal-card',
    component: RebuttalCardComponent
  },
  {
    path:'discussionhub',
    component: DiscussionhubComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
