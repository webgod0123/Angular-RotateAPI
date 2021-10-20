import { Component, Input, OnInit } from '@angular/core';
import { SurveyResponse } from 'src/app/models/DTOs/Responses/survey-response.model';
import { User } from 'src/app/models/user.model';
import { SurveyService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-follower-bipart-menu',
  templateUrl: './follower-bipart-menu.component.html',
  styleUrls: ['./follower-bipart-menu.component.css']
})
export class FollowerBipartMenuComponent implements OnInit {

  constructor(private survey_svc  : SurveyService) { }

  @Input() user_list : number[];
  @Input() opp_val : number;
  @Input () count : number;
  
  abortion_num : number = 0;
  border_num : number = 0;
  climate_num : number = 0;
  infra_num : number = 0;
  military_num :number = 0;
  
  total_abort_num : number = 0;
  total_border_num : number = 0;
  total_clim_num : number = 0;
  total_infra_num : number = 0;
  total_military_num : number = 0;

  async ngOnInit() 
  {
    for(let user of this.user_list)
    {
      await this.GetSurvey(user);
    }
    this.CalcNumbers();
  }
  CalcNumbers()
  {
    this.abortion_num = 100 * ((this.total_abort_num + 2 * this.count) / (14 * this.count))
    this.border_num = 100 * ((this.total_border_num + 3 * this.count) / (12 * this.count));
    this.climate_num = 100 * ((this.total_clim_num + 3 * this.count) / (12 * this.count));
    this.infra_num = 100 * ((this.total_infra_num + 10 * this.count) / (8 * this.count));
    this.military_num = 100 * ((this.total_military_num - 3 * this.count) / (12 * this.count));
  }
  async GetSurvey(id : number)
  {
    await this.survey_svc.GetSurvey(id).then(
      (data:SurveyResponse) =>
      {
        this.total_abort_num += -data.survey.abortion;
        this.total_border_num += -data.survey.borderControl;
        this.total_clim_num += -data.survey.climateChange;
        this.total_infra_num += -data.survey.infrastructure;
        this.total_military_num += -data.survey.militaryViolence;
      }
    )
  }
}
