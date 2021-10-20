import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Quill from 'quill';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

@Component({
  selector: 'app-texteditor',
  templateUrl: './texteditor.component.html',
  styleUrls: ['./texteditor.component.css']
})
export class TexteditorComponent implements OnInit {
  public Editor = ClassicEditor;

  
  constructor() { }

  ngOnInit(): void {


  }



}
