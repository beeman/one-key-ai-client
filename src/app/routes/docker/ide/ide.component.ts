import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ide',
  templateUrl: './ide.component.html',
  styleUrls: ['./ide.component.scss']
})
export class IdeComponent implements OnInit {
  constructor(
    private readonly location: Location,
  ) { }

  ngOnInit() {
  }

  onShellEvent(event: string): void {
    if (event === 'end') {
      this.location.back();
    }
  }
}
