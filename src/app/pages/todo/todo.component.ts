import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { iTask } from 'src/app/models/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  task: iTask[] = [];
  inProgress: iTask[] = [];
  done: iTask[] = [];
  isEdit: boolean = false;
  updateid!: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
    });
    if (localStorage.getItem('task')) {
      let tasks: string = localStorage.getItem('task') || '';
      this.task = JSON.parse(tasks);
    }
    if (localStorage.getItem('task')) {
      let tasks: string = localStorage.getItem('inProgress') || '';
      this.inProgress = JSON.parse(tasks);
    }
    if (localStorage.getItem('task')) {
      let tasks: string = localStorage.getItem('done') || '';
      this.done = JSON.parse(tasks);
    }
  }

  edit(item: iTask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);
    this.updateid = i;
    this.isEdit = true;
  }

  update() {
    this.task[this.updateid].description = this.todoForm.value.item;
    this.todoForm.reset();
    this.isEdit = false;
    this.updateid = undefined;
    this.save();
  }

  addTask() {
    this.task.push({
      description: this.todoForm.value.item,
    });
    this.todoForm.reset();
    this.save();
  }

  deletetask(i: number) {
    this.task.splice(i, 1);
    this.save();
  }

  deleteinProgress(i: number) {
    this.inProgress.splice(i, 1);
    this.save();
  }

  deletedone(i: number) {
    this.done.splice(i, 1);
    this.save();
  }

  save() {
    localStorage.setItem('task', JSON.stringify(this.task));
    localStorage.setItem('inProgress', JSON.stringify(this.inProgress));
    localStorage.setItem('done', JSON.stringify(this.done));
  }

  drop(event: CdkDragDrop<iTask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.save();
  }
}
