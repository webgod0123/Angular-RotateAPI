import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AreYouSureComponent } from 'src/app/common/are-you-sure/are-you-sure.component';
import { User_Response } from 'src/app/models/DTOs/Responses/user_response.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  constructor(private svc : AuthService,
              private dialog : MatDialog,
              private router : Router) { }
  dropdown_hover : boolean = false;
  searchS : string = "";
  ngOnInit()
  {
    
  }
  ToggleHover()
  {
    this.dropdown_hover = !this.dropdown_hover;
  }
  Search()
  {
    this.router.navigate(['/search/' + this.searchS]);
  }
  LogOutUser()
  {
    const dialogRef = this.dialog.open(AreYouSureComponent, {
      width: '250px',
      data: "log out?"
    });

    dialogRef.afterClosed().subscribe(
      result => {
      console.log('The dialog was closed');
      if(result)
      {
        this.svc.LogOutUser();
        this.router.navigate(['/landing']);
      }
    });
  }
}
