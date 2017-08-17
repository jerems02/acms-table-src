import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { AcmsTableComponent } from './acms-table.component';

describe('AcmsTableComponent', () => {

  let comp:    AcmsTableComponent;
  let fixture: ComponentFixture<AcmsTableComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmsTableComponent ], // declare the test component
    });

    fixture = TestBed.createComponent(AcmsTableComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
  });

  it('Should be false', () => {
    expect(false).toBe(true);
  });
});
