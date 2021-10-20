import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

/**
 * This class is a simple navigation service that saves the
 * history of what pages the user has gone through and can 
 * send them back to the previous page
 */
export class NavigationService {

  private history : string[] = [] // storage of history

  constructor(private router : Router,
              private location : Location) 
  { 
    this.router.events.subscribe(
      (event) =>
      {
        if(event instanceof NavigationEnd)
        {
          this.history.push(event.urlAfterRedirects) // push the current url to the history
        }
      }
    );
  }
  back() : void
  {
    this.history.pop()
    
    if(this.history.length > 0)
    {
      this.location.back()
    }
    else
    {
      this.router.navigateByUrl('/home');
    }
  }
  
}
