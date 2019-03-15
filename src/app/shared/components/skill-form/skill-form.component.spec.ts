import { LayoutModule } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfCoreModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { SkillFormComponent } from 'app/shared/components/skill-form/skill-form.component';

describe('SkillFormComponent', () => {
  let component: SkillFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        SkillFormComponent,
      ],
      imports: [
        DfButtonModule,
        DfCoreModule.forRoot(),
        DfInputModule,
        DfSelectModule,
        DfValidationMessagesModule.forRoot(),
        LayoutModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        DfMouseUpService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SkillFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should filter entries successfully', () => {
    const searchTerm = 'Search term';

    fixture.detectChanges();
    component.selector.dfSelectFilterText = searchTerm;
    component.filter
      .pipe(take(1))
      .subscribe(term => expect(term).toBe(searchTerm));

    component.onSearch();
  });

  it('should save skills successfully', () => {
    const skill = 'Angular';

    fixture.detectChanges();
    component.form.patchValue({ skill });
    component.save
      .pipe(take(1))
      .subscribe(candidate =>
          expect(candidate.skills).toContain(jasmine.objectContaining({ skill }))
      );

    component.onSubmit();
  });
});
