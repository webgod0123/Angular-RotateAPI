import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  

  constructor(private elementRef:ElementRef,
              private user_svc : UserService,
              private router : Router) { }

  ngOnInit(): void 
  {
    if(this.user_svc.GetLoggedInUser())
    {
      this.router.navigate(['/home'])
    }  
  }
  
}
