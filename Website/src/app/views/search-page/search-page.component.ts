import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationService } from 'src/app/bandaid/navigation.service';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  constructor(private navigation_svc : NavigationService,
              private route : ActivatedRoute) { }

  ngOnInit(): void 
  {
    this.route.params
      .subscribe(
        (params) =>
        {
          this.search = params.id;
        }
      )
  }
  
  search : string;

  async searchListInit()
  {

  }
  async onSearch(se : string)
  {
    this.search = se;
    
    if(this.search == null || this.search == '')
    {

    }
    else
    {
      await this.searchListInit();
    }
  }
  back()
  {
    this.navigation_svc.back;
  }
}
