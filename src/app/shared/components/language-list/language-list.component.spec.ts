import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { LanguageListComponent } from 'app/shared/components/language-list/language-list.component';

import { CandidateLanguage, Language, LanguageProficiency } from 'app/core/models/candidate';



describe('LanguageListComponent', () => {
  let component: LanguageListComponent;
  let fixture: ComponentFixture<typeof component>;
  const candidateLanguage = new CandidateLanguage(
    1,
    new Language(1, 'Portuguese'),
    1
  );

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        LanguageListComponent,
      ],
      imports: [
      ],
      providers: [
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LanguageListComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should change the selected entry successfully', async(() => {
    component.selectedEntryChange
      .pipe(take(1))
      .subscribe(entry => expect(entry).toBe(candidateLanguage));
    component.onSelect(candidateLanguage);
    expect(component.selectedEntry).toBe(candidateLanguage);
  }));

  it('should grab the language proficiency based on its ID', () => {
    const proficiency = LanguageProficiency.fromId(1);
    expect(proficiency.name).toBe('Conversational');
  });
});
