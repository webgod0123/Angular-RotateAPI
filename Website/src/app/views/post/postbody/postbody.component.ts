import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-postbody',
  templateUrl: './postbody.component.html',
  styleUrls: ['./postbody.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom

})
export class PostbodyComponent implements OnInit {

  @Input() innerHTML:string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.innerHTML)
  }

}
