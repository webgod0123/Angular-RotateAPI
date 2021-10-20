import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CustomOption } from "ngx-quill";


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  editForm: FormGroup;
  isEditable: boolean;
  text: string = "<p>hello</p><p>world</p><p>!</p>";

  // options: CustomOption[] = [
  //   {
  //     import: "attributors/style/size",
  //     whitelist: void 0
  //   }
  // ];

  ngOnInit() {
    this.isEditable = false;
    this.editForm = new FormGroup({
      text: new FormControl(null, Validators.required)
    });
  }

  edit() {
    this.editForm.controls["text"].patchValue(this.text);
    /* this.editForm.patchValue({
      text: this.text
    });*/

    this.isEditable = true;
  }

  submit() {
    this.text = this.editForm.value.text;
    this.editForm.reset();
    this.isEditable = false;
  }
}
