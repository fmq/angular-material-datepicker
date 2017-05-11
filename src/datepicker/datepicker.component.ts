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

  @Input()
  locale = 'en-US';

  @Input()
  labels: {};

  @Input()
  get date(): Date {
    return this.dateVal;
  };

  set date(val: Date) {
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
    console.log($event);
  }

  // Validates the user input and if it's not a valid date it opens
  // the dialog.
  _validateDate() {

    let dd = moment(this.date, this.format);
    console.log(dd);
    if (isNaN(new Date(this.date).getDate())) {
      this._openDialog();
    }
  }

  _openDialog() {

    this.config.data.date = this.date;

    let ref = this.dialog.open(CalendarComponent, this.config);

    // Workaround to update style of dialog which sits outside of the component
    let containerDiv = (<any>ref)._overlayRef._pane.children[0];
    containerDiv.style['padding'] = '0';

    ref.componentInstance.submit.subscribe(result => {
      this.date = result;
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
