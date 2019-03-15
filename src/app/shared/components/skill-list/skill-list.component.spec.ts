import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { CandidateSkill, Skill } from 'app/core/models/candidate';
import { SkillListComponent } from 'app/shared/components/skill-list/skill-list.component';

describe('SkillListComponent', () => {
  let component: SkillListComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        SkillListComponent,
      ],
      imports: [
        DfButtonModule,
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
      fixture = TestBed.createComponent(SkillListComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should edit an entry successfully', () => {
    const editMode = true;

    component.editChange
      .pipe(take(1))
      .subscribe(edit => {
        expect(edit).toBe(editMode);
        expect(component.edit).toBe(editMode);
      });

    component.onEdit(editMode);
  });

  it('should delete an entry successfully', async(() => {
    const skill = new Skill(1, 'Angular');
    const candidateSkill = new CandidateSkill(1, skill, 0);

    component.delete
      .pipe(take(1))
      .subscribe(candidate =>
        expect(candidate.skills).toContain(jasmine.objectContaining({
          ...candidateSkill,
          markedToDelete: true,
        }))
      );

    component.onEdit(true);
    component.onDelete(candidateSkill);
  }));
});
