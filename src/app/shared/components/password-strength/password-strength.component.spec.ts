import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthComponent } from './password-strength.component';

describe('PasswordStrengthComponent', () => {

  let component: PasswordStrengthComponent;
  let fixture: ComponentFixture<PasswordStrengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ PasswordStrengthComponent ],
      providers: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordStrengthComponent);
    component = fixture.componentInstance;
    component.passwordToCheck = 'SamplePass123';
    component.barLabel = 'Some Bar Label';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should measureStrength', () => {
    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123', 'samp', true),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123', 'sampass', true),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123', 'sampass123', false),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123', 'sampass123sampass123', false),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123', 'sampasssampasssampasssampasssas', false),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123', 'SamplePass123SamplePass123Sa', false),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123',
        'SamplePass123SamplePass123SamplePas', false),
    });

    component.ngOnChanges({
      passwordToCheck: new SimpleChange('SamplePass123',
        'SamplePass123SamplePass123SamplePas123sds', false),
    });
  });
});

