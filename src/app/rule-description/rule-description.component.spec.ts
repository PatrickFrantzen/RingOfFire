import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleDescriptionComponent } from './rule-description.component';

describe('RuleDescriptionComponent', () => {
  let component: RuleDescriptionComponent;
  let fixture: ComponentFixture<RuleDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
