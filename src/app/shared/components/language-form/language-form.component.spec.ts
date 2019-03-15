import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DfButtonModule,
  DfCoreModule,
  DfDatepickerModule,
  DfInputModule,
  DfMouseUpService,
  DfSelectModule,
  DfValidationMessagesModule,
} from '@devfactory/ngx-df';
import { take } from 'rxjs/operators';

import { CandidateLanguage, Language, LanguageProficiency } from 'app/core/models/candidate';
import { LanguageFormComponent } from 'app/shared/components/language-form/language-form.component';



describe('LanguageFormComponent', () => {
  let component: LanguageFormComponent;
  let fixture: ComponentFixture<typeof component>;
  let candidateLanguage: CandidateLanguage;

  const languagesList = [
    new Language(1, 'Portuguese'),
    new Language(2, 'English'),
    new Language(3, 'Français'),
    new Language(4, '日本語'),
  ];

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        LanguageFormComponent,
      ],
      imports: [
        DfCoreModule.forRoot(),
        DfButtonModule,
        DfDatepickerModule,
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
      fixture = TestBed.createComponent(LanguageFormComponent);
      component = fixture.componentInstance;
      candidateLanguage = new CandidateLanguage(
        1,
        languagesList[0],
        LanguageProficiency.entries[0].id
      );
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load initial value data successfully', () => {
    component.languages = languagesList;
    component.proficiencies = LanguageProficiency.entries;
    component.initialValue = candidateLanguage;

    delete candidateLanguage.proficiency;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should submit data successfully', async(() => {
    fixture.detectChanges();

    component.languages = languagesList;
    component.form.patchValue(candidateLanguage);
    component.save
      .pipe(take(1))
      .subscribe(data =>
        expect(data.languages).toContain(jasmine.objectContaining({ id: candidateLanguage.id }))
      );
    component.onSubmit();
  }));

  it('should delete data successfully', async(() => {
    const languageMarkedToDelete = Object.assign({
      id: candidateLanguage.id,
      markedToDelete: true,
    });
    component.remove
      .pipe(take(1))
      .subscribe(
        ({ languages }) => expect(languages).toContain(jasmine.objectContaining(languageMarkedToDelete))
      );

    component.onDelete(candidateLanguage);
  }));

  it('should manage language data corner cases successfully', () => {
    const language = Language.from(undefined);
    expect(language).toBeUndefined();

    const found = Language.findById(undefined, 1);
    expect(found).toBeUndefined();
  });
});
