/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component } from '@angular/core';
import { NbComponentShape, NbComponentSize, NbComponentStatus, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-buttons',
  styleUrls: ['./buttons.component.scss'],
  templateUrl: './buttons.component.html',
})
export class ButtonsComponent {
  public constructor(private readonly themeService: NbThemeService) {
    this.materialTheme$ = this.themeService.onThemeChange()
      .pipe(map(theme => {
        const themeName: string = (theme && theme.name) || '';
        return themeName.startsWith('material');
      }));
  }

  public readonly materialTheme$: Observable<boolean>;

  public readonly statuses: NbComponentStatus[] = [ 'primary', 'success', 'info', 'warning', 'danger' ];
  public readonly shapes: NbComponentShape[] = [ 'rectangle', 'semi-round', 'round' ];
  public readonly sizes: NbComponentSize[] = [ 'tiny', 'small', 'medium', 'large', 'giant' ];
}
