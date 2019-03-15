import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito';

import { CandidateService } from 'app/core/services/candidate/candidate.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { UserProfilePageComponent } from 'app/modules/profile/pages/user-profile-page/user-profile-page.component';

describe('UserProfilePageComponent', () => {
  let component: UserProfilePageComponent;
  let fixture: ComponentFixture<typeof component>;
  let candidateService: CandidateService;
  let identityService: IdentityService;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        UserProfilePageComponent,
      ],
      providers: [
        { provide: CandidateService, useFactory: () => mock(CandidateService) },
        {
          provide: ActivatedRoute, useValue: {
            queryParams: of({}),
          },
        },
        { provide: IdentityService, useFactory: () => mock(IdentityService) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(UserProfilePageComponent);
      component = fixture.componentInstance;
      candidateService = TestBed.get(CandidateService);
      identityService = TestBed.get(IdentityService);
    })
  );

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('[ngOnInit] should load current user detail successfully', () => {
    spyOn(identityService, 'getCurrentUser').and.returnValue(
      of({ id: 1 }).pipe(take(1))
    );
    spyOn(identityService, 'getCurrentUserAs').and.returnValue(of({}).pipe(take(1)));
    spyOn(candidateService, 'importProfile').and.returnValue(of({}).pipe(take(1)));
    fixture.detectChanges();
  });

});
