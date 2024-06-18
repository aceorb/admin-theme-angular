/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ngx-form-inputs',
  styleUrls: ['./form-inputs.component.scss'],
  templateUrl: './form-inputs.component.html',
})
export class FormInputsComponent implements OnInit {

  materialTheme$: Observable<boolean>;

  showMaterialInputs = false;
  radioGroupValue: string = 'This is value 2';

  constructor(private readonly themeService: NbThemeService) { }

  ngOnInit() {
    this.materialTheme$ = this.themeService.onThemeChange()
      .pipe(tap(theme => {
        const themeName: string = theme?.name || '';
        this.showMaterialInputs = themeName.startsWith('material');
      }));
  }
}
