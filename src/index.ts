import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcmsTableComponent } from './acms-table.component';
import { TranslateModule } from "ng2-translate";
import { AcmsSwitchModule } from "acms-switch";

export * from './acms-table.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AcmsSwitchModule
  ],
  declarations: [
    AcmsTableComponent
  ],
  exports: [
    AcmsTableComponent
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
