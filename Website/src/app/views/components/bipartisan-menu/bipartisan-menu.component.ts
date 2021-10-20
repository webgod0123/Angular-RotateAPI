import { Component, Input, OnInit } from '@angular/core';
import { Survey } from 'src/app/models/survey.model';

@Component({
  selector: 'app-bipartisan-menu',
  templateUrl: './bipartisan-menu.component.html',
  styleUrls: ['./bipartisan-menu.component.css']
})
export class BipartisanMenuComponent implements OnInit {

  constructor() { }
  @Input() survey : Survey;

  abortion_num : number = 0;
  border_num : number = 0;
  climate_num : number = 0;
  infra_num : number = 0;
  military_num :number = 0;
  ngOnInit(): void 
  {
    this.CalcNumbers();
  }
  CalcNumbers()
  {
    this.abortion_num = 100 * ((-this.survey.abortion + 2) / 14)
    this.border_num = 100 * ((-this.survey.borderControl + 3) / 12);
    this.climate_num = 100 * ((-this.survey.climateChange + 3) / 12);
    this.infra_num = 100 * ((-this.survey.infrastructure + 10) / 8);
    this.military_num = 100 * ((-this.survey.militaryViolence - 3) / 12);
  }
}
