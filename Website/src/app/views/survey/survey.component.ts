import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyResponse } from 'src/app/models/DTOs/Responses/survey-response.model';
import { Survey } from 'src/app/models/survey.model';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  constructor(private router:Router,
              private survey_svc : SurveyService,
              private user_svc : UserService) { }

  user_id : number = this.user_svc.GetCurrentUserID()!;
  survey : Survey = new Survey();
  question_arr : string[] = new Array(15);

  ngOnInit(): void{
  }
  /*
   ! LEFTMOST ANSWERS : 15;
   ! CENTERMOST ANSWERS : -14;
   ! RIGHTMOST ANSWERS : -43;
   */
  OnSubmit(form : NgForm)
  {
    this.survey.climateChange = Number.parseInt(this.question_arr[0]) - Number.parseInt(this.question_arr[1])
        - Number.parseInt(this.question_arr[2]);
    this.survey.borderControl = -Number.parseInt(this.question_arr[3]) + Number.parseInt(this.question_arr[4]) 
        - Number.parseInt(this.question_arr[5]);
    this.survey.militaryViolence = -Number.parseInt(this.question_arr[6]) - Number.parseInt(this.question_arr[7])
        - Number.parseInt(this.question_arr[8]);
    this.survey.infrastructure = Number.parseInt(this.question_arr[9]) + Number.parseInt(this.question_arr[10]);
    this.survey.abortion = Number.parseInt(this.question_arr[11]) - Math.round((Number.parseInt(this.question_arr[12]) / 2))
        - Number.parseInt(this.question_arr[13]) - Number.parseInt(this.question_arr[14]);
    this.survey.total = this.survey.abortion + this.survey.borderControl + this.survey.climateChange
      + this.survey.infrastructure + this.survey.militaryViolence;
    this.survey.userID = this.user_id
    this.survey_svc.NewSurvey(this.survey).then(
      (data:SurveyResponse) =>
      {
        console.log(data)
      },
      (error:SurveyResponse) =>
      {
        console.error(error);
      }
    )
    this.redirect();
  }
  redirect(){
    this.router.navigate(['/home']);
  }

}
