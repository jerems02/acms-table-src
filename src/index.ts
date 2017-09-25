import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcmsTableComponent } from './acms-table.component';
import { TranslateModule } from "ng2-translate";
import { AcmsSwitchModule } from "acms-switch";
import { DataComponent } from "./data/acms-data.component";

export * from './acms-table.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AcmsSwitchModule
  ],
  declarations: [
    AcmsTableComponent,
    DataComponent
  ],
  exports: [
    AcmsTableComponent,
    DataComponent
  ]
})
export class AcmsTableModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AcmsTableModule,
      providers: []
    };
  }
}
