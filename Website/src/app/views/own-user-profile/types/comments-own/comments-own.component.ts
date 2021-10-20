import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-comments-own',
  templateUrl: './comments-own.component.html',
  styleUrls: ['./comments-own.component.css']
})
export class CommentsOwnComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() user : User;
  @Input() profile : Profile;
}
