import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @Output() uploadImage = new EventEmitter<Event>();

  constructor() {}

  ngOnInit(): void {}

  onUploadImages(event: Event): void {
    this.uploadImage.emit(event);
  }
}
