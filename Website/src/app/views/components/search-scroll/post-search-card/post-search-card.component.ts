import { Component, Input, OnInit } from '@angular/core';
import { PostSearch } from 'src/app/models/Search/post-search.model';

@Component({
  selector: 'app-post-search-card',
  templateUrl: './post-search-card.component.html',
  styleUrls: ['./post-search-card.component.css']
})
export class PostSearchCardComponent implements OnInit {

  constructor() { }
  @Input() item : PostSearch;
  date : string
  ngOnInit(): void 
  {
    this.date = this.formatDate(this.item.timestamp);
  }
  formatDate(date:Date){
    // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString("en-US"); 
  }
}
