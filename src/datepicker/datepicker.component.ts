import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MdDialog, MdDialogRef, MdDialogConfig, MdSnackBar } from '@angular/material';

import { CalendarComponent } from './calendar.component';
import { Month } from './month.model';
import { Weekday } from './weekday.model';
import { LANG_EN } from './lang-en';

import * as moment from 'moment';

@Component({
  selector: 'md-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatePickerComponent implements OnInit {

  private readonly dialog: MdDialog;
  private dateVal: Date;

  _dayNames: Array<Weekday>;
  _monthNames: Array<Month>;
  _formattedDate: Date;
  _yearSelectorVisible = false;

  @Output()
  dateChange = new EventEmitter<Date>();

  @Input()
  placeholder: string;

  @Input()
  format = 'mediumDate';

  // response type expected. can be date | time
  @Input()
  responseFormat = 'time';

  @Input()
  locale = 'en-US';

  @Input()
  labels: {};

  @Input()
  get date(): any {
    return this.dateVal;
  };

  set date(val: any) {
    this.dateVal = val;
    this.dateChange.emit(val);
  }

  config: MdDialogConfig = {
    disableClose: true,
    width: '276px',
    data: {}
  };

  private enLabels = {'ok': 'Ok',
                    'cancel': 'Cancel',
                    'today': 'Today'
                  };


  constructor(dialog: MdDialog) {
    this.dialog = dialog;
    this._dayNames = LANG_EN.weekDays;
    this._monthNames = LANG_EN.months;
  }

  ngOnInit() {
    this.setLabels();
  }

  _updateDate($event) {
    // create the date
    // If we fail then open the dialog
    try {
      let d: Date = new Date($event.target.value);
      // validate against input format.
      new DatePipe(this.locale).transform(d, this.format);

      // if all is well set the date based on expected return (date | time).
      this.date = this.responseFormat === 'time' ? d.getTime() : d;

    } catch (_ex) {
      console.log(_ex);
      this._openDialog();
    }
  }

  _openDialog() {
    console.log('_openDialog');
    if (this.date) {
      this.config.data.date = new Date(this.date);
    }

    let ref = this.dialog.open(CalendarComponent, this.config);

    // Workaround to update style of dialog which sits outside of the component
    let containerDiv = (<any>ref)._overlayRef._pane.children[0];
    containerDiv.style['padding'] = '0';

    ref.componentInstance.submit.subscribe(result => {
      this.date = result;
      this.dateChange.emit(result.getTime());
      ref.close();
    });
    ref.componentInstance.cancel.subscribe(result => {
      ref.close();
    });
  }

  private setLabels() {
    // Set default labels
    if (!this.labels) {
      this.labels = this.enLabels;
    } else {
      // complete missing attributes.
      for (let prop in this.enLabels ) {
          if ( this.enLabels.hasOwnProperty(prop) ) {
              if ( !(this.labels[prop]) ) {
                  this.labels[prop] = this.enLabels[prop];
              }
          }
      }
    }

    // Set the labels for the CalendarComponent
    this.config.data.labels = this.labels;
  }

}
