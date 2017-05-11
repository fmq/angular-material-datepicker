import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-Material-Datepicker Demo';
  mydate: Date = new Date("October 13, 2014 11:13:00");
  calendarLabels: any = {'ok': 'Select'};
}
