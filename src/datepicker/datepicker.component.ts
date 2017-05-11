import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MdDialog, MdDialogRef, MdDialogConfig, MdSnackBar } from '@angular/material';

import { CalendarComponent } from './calendar.component';
import { Month } from './month.model';
import { Weekday } from './weekday.model';
import { LANG_DE } from './lang-de';

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

  private enLabels = {'ok': 'Ok',
                      'cancel': 'Cancel',
                      'today': 'Today'
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

  constructor(dialog: MdDialog) {
    this.dialog = dialog;
    this._dayNames = LANG_DE.weekDays;
    this._monthNames = LANG_DE.months;
  }

  ngOnInit() {
    if (this.date === undefined) {
      this.date = new Date();
    }

    this.setLabels();
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
