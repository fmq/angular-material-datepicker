import { animate, Component, EventEmitter, Input, keyframes, OnInit, Output, style, transition, trigger, Inject } from '@angular/core';
import { MD_DIALOG_DATA }  from '@angular/material';

import { CalendarService } from './calendar.service';
import { Month } from './month.model';
import { Weekday } from './weekday.model';
import { LANG_EN } from './lang-en';

@Component({
  selector: 'md-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('calendarAnimation', [
      transition('* => left', [
        animate('0.225s ease-in-out', keyframes([
          style({ transform: 'translateX(105%)', offset: 0.5 }),
          style({ transform: 'translateX(-130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 }),
        ]))
      ]),
      transition('* => right', [
        animate('0.225s ease-in-out', keyframes([
          style({ transform: 'translateX(-105%)', offset: 0.5 }),
          style({ transform: 'translateX(130%)', offset: 0.51 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class CalendarComponent implements OnInit {

  private readonly calendarService: CalendarService;

  private dateVal: Date;

  @Output()
  dateChange = new EventEmitter<Date>();

  @Input()
  get date(): Date {
    return this.dateVal;
  };

  set date(val: Date) {
    this.dateVal = val;
    this.dateChange.emit(val);
    this.updateDate(val);
  }

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  submit = new EventEmitter<Date>();

  _dayNames: Array<Weekday>;
  _monthNames: Array<Month>;
  _today: Date = new Date(); 

  _currentMonth: Month;
  _currentMonthNumber: number;
  _currentYear: number;
  _currentDay: number;
  _currentDayOfWeek: Weekday;

  _displayMonth: Month;
  _displayMonthNumber: number;
  _displayYear: number;
  _displayDays: Array<number>;

  _years: number[] = [];

  _isYearsVisible = false;

  animate: string;

  _labels: any = {};

  private selectDatetimeout: any;

  constructor(calendarService: CalendarService, @Inject(MD_DIALOG_DATA) private data: any) {

    this.calendarService = calendarService;
    this._dayNames = LANG_EN.weekDays;
    this._monthNames = LANG_EN.months;

    this.loadYears();
    // Set labels
    this._labels = data.labels;

    // Set passed date
    if (data.date) {
        this.date = data.date;
    };
  }

  ngOnInit() {

    if (!this.date) {
      this.date = new Date();
    }
  }

  _getDayBackgroundColor(day: Date) {
    if (this.equalsDate(day, this.date)) {
      return 'day-background-selected';
    } else {
      return 'day-background-normal';
    }
  }

  _getDayForegroundColor(day: Date) {
    if (this.equalsDate(day, this.date)) {
      return 'day-foreground-selected';
    } else if (this.equalsDate(day, this._today)) {
      return 'day-foreground-today';
    } else {
      return 'day-foreground-normal';
    }
  }

  _onToday() {
    this.date = this._today;
  }

  _onPrevMonth() {
    if (this._displayMonthNumber > 0) {
      this.update_Display(this._displayYear, this._displayMonthNumber - 1);
    } else {
      this.update_Display(this._displayYear - 1, 11);
    }
    this.triggerAnimation('left');
  }

  _onNextMonth() {
    if (this._displayMonthNumber < 11) {
      this.update_Display(this._displayYear, this._displayMonthNumber + 1);
    } else {
      this.update_Display(this._displayYear + 1, 0);
    }
    this.triggerAnimation('right');
  }

  _onSelectDate(date: Date) {
    this.selectDatetimeout = setTimeout(() => {
      this.date = date;
    }, 150);

  }

  _onSelectYear(year: number) {
    // update the year of the current date
    this.date.setFullYear(year);
    // update the calendar
    this.updateDate(this.date);
    // hide the year selector
    this._isYearsVisible = false;
  }

  _selectAndClose(date: Date){
    // Cancel the selectDateTimeout 
    if (this.selectDatetimeout) {
      clearTimeout(this.selectDatetimeout);
    }
    // Set the date
    this.date = date;
    // submit to close
    this._onOk();

  }
  _onCancel() {
    this.cancel.emit();
  }

  _onOk() {
    this.submit.emit(this.date);
  }

  _showYears() {
    // Scroll year to selected year
    setTimeout(() => {
      let container: any = document.querySelector('.md-datepicker-years-selector'),
      selected: any = document.querySelector('.md-datepicker-years-selector .year.selected');
      container.scrollTop = (selected.offsetTop + 20) - container.clientHeight / 2;

      // Show the years 
      this._isYearsVisible = true;
    }, 0);
  }

  private loadYears(): void {
    let idx = 1970
      , max = new Date().getFullYear() + 100;

    for (idx; idx < max; idx ++ ) {
      this._years.push(idx);
    }
  }

  private updateDate(date: Date) {
    console.log('updateDate', date);
    this._currentMonthNumber = date.getMonth();
    this._currentMonth = this._monthNames[this._currentMonthNumber];
    this._currentYear = date.getFullYear();
    this._currentDay = date.getDate();
    this._currentDayOfWeek = this._dayNames[date.getDay()];
    this.update_Display(this._currentYear, this._currentMonthNumber);
  }

  private update_Display(year: number, month: number) {
    const calendarArray = this.calendarService.monthDays(year, month);
    this._displayDays = [].concat.apply([], calendarArray);
    this._displayMonthNumber = month;
    this._displayMonth = this._monthNames[month];
    this._displayYear = year;
  }

  private equalsDate(date1: Date, date2: Date): boolean {
    try {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    } catch (error) {
      return  false;
    }
  }

  private triggerAnimation(direction: string): void {
    this.animate = direction;
    setTimeout(() => this.animate = 'reset', 230);
  }
}
