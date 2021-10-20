import { Component, Input, OnInit } from '@angular/core';
import { UserSearch } from 'src/app/models/Search/user-search.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  constructor(private user_svc : UserService) { }
  @Input() item : UserSearch;
  router_url : string;
  ngOnInit(): void 
  {
    this.router_url = (this.item.userID == this.user_svc.GetCurrentUserID()!) ? '/profile' : '/u/' + this.item.username;
  }

}
