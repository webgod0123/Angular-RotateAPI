import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bug } from 'src/app/models/bug.model';
import { BugResponse } from 'src/app/models/DTOs/Responses/bugresponse.model';
import { BugService } from 'src/app/services/bug.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

type NewType = UserService;

@Component({
  selector: 'app-report-bug',
  templateUrl: './report-bug.component.html',
  styleUrls: ['./report-bug.component.css']
})
export class ReportBugComponent implements OnInit {

  constructor(public postSvc: PostService,
              private user_svc : UserService, 
              private router : Router,
              private bug_svc : BugService) { }

  ngOnInit(): void {
  }

  async OnSubmit(){
    let name = document.getElementById("Name") as HTMLTextAreaElement;
    let email = document.getElementById("Email") as HTMLTextAreaElement;
    let msg = document.getElementById("message") as HTMLTextAreaElement;

    let newReport = new bug();
    newReport.body = msg.value;
    newReport.email = email.value;
    newReport.username = name.value;
    newReport.subject = "Bug Report " + Date.now();
    await this.bug_svc.SendReport(newReport).then(
      (data:BugResponse) =>
      {
        console.log(data)
      },
      (error:BugResponse) =>
      {
        console.error(error);
      }
    )
    this.router.navigate(['/home']);
    // newReport.username = this.user_svc.GetUserName(this.user_svc.GetCurrentUserID()!.toString());
  }
}
