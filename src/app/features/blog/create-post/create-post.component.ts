import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { ImageResize } from 'quill-image-resize-module-ts';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../core/services/post.service';

Quill.register('modules/imageResize', ImageResize);

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    EditorModule,
    CommonModule,
    QuillModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  quillModules: any;
  postForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
  ) {
    this.quillModules = {
      imageResize: {
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
        handleStyles: {
          border: 'none',
        },
        overlayStyles: {
          boxSizing: 'border-box',
          border: '5px solid #57b093',
        },
      },
    };
  }

  onEditorChanged(event: any) {
    this.postService.newPost.update((prev) => {
      return {
        ...prev,
        content: this.postForm.controls['content'].value,
      };
    });
    console.log(this.postService.newPost());
  }

  //kiem tra xem form co bi thay doi ko
  // neu co thi cap nhat lai postService.newPost
  //chi ktr duoc title va shortDescription
  //quill co function onEditorChanged
  onFormChanged(event: any) {
    this.postService.newPost.update((prev) => {
      return {
        ...prev,
        title: this.postForm.controls['title'].value,
        shortDescription: this.postForm.controls['shortDescription'].value,
      };
    });
    console.log(this.postService.newPost());
    
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      shortDescription: '',
      content: ['', Validators.required],
    });
  }
}
