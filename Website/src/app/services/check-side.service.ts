import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckSideService {

  constructor() { }

  GetTotalSide(total : number) : number
  {
    if(total <= -33)
    {
      return 2
    }
    else if (total >= 5)
    {
      return -2
    }
    else if(total >= -9)
    {
      return -1
    }
    else if(total <= -19)
    {
      return 1
    }
    else
    {
      return 0
    }
  } // end function
  
} // end class
