import { Injectable } from '@angular/core';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class FileValidationService {

  constructor() { }
  validateFile(name: string) 
  {
    var ext = name.toString().substring(name.toString().lastIndexOf('.') + 1);
    console.log(ext.toString());
    if (ext.toLowerCase() == 'jpeg' ||ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'gif') {
        return true;
    }
    else {
        return false;
    }
  }
  checkTokenExp(token : Token)
  {
    return (Math.floor((new Date).getTime() / 1000) >= token.exp);
  }
}
