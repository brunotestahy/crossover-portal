import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators';
import { mock } from 'ts-mockito/lib/ts-mockito';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { Candidate } from 'app/core/models/candidate';
import { CurrentUserDetail } from 'app/core/models/identity';
import { Manager } from 'app/core/models/manager';
import { ResidenceInfo } from 'app/core/models/residence-info';
import { Team } from 'app/core/models/team';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { IdentityService } from 'app/core/services/identity/identity.service';
import { environment } from 'environments/environment';

describe('IdentityService', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let service: IdentityService;
  let authTokenService: AuthTokenService;
  let router: Router;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          IdentityService,
          { provide: AuthTokenService, useFactory: () => mock(AuthTokenService) },
          { provide: Router, useFactory: () => mock(Router) },
        ],
      });
    })
  );

  beforeEach(() => {
    httpMock = getTestBed().get(HttpTestingController);
    httpClient = getTestBed().get(HttpClient);
    service = getTestBed().get(IdentityService);
    authTokenService = getTestBed().get(AuthTokenService);
    router = getTestBed().get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('forgotPassword', () => {

    it('should delegate call the endpoint for response', () => {
      const SAMPLE_REQUEST = { email: 'sample@example.org' };
      const SAMPLE_RESPONSE = Object.assign({});
      service.forgotPassword(SAMPLE_REQUEST).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });

      const request = httpMock.expectOne(
        environment.apiPath +
        `/identity/users/?action=reset&email=${SAMPLE_REQUEST.email}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

  });

  describe('updatePassword', () => {

    it('should delegate call the endpoint for response', () => {
      const SAMPLE_REQUEST = {
        passwordResetToken: 'sample-token',
        rawPassword: 'sample-password',
        securityQuestion: 'sample-security-question',
        securityQuestionAnswer: 'sample-answer',
      };
      const SAMPLE_RESPONSE = Object.assign({});
      service.updatePassword(SAMPLE_REQUEST).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });

      const request = httpMock.expectOne(
        environment.apiPath +
        '/identity/users/?action=updatePassword&userToken=sample-token'
      );
      expect(request.request.method).toBe('PUT');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

  });

  describe('confirmForgotPasswordToken', () => {

    it('should delegate call the endpoint for response', () => {
      const SAMPLE_REQUEST = '12345';
      const SAMPLE_RESPONSE = {
        securityQuestion: 'sample-security-question',
        linkedInLogin: false,
        enabled: true,
        accountNonExpired: true,
        accountNonLocked: true,
        credentialsNonExpired: true,
      };
      service.confirmForgotPasswordToken(SAMPLE_REQUEST).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE);
      });

      const request = httpMock.expectOne(
        environment.apiPath +
        '/identity/users/?action=confirmToken&passwordResetToken=12345'
      );
      expect(request.request.method).toBe('GET');
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

  });

  describe('isUserLogged', () => {

    it('should return true if there is a current logged in user', () => {
      service.login('test@test', 'password').subscribe();

      const authRequest = httpMock.expectOne(environment.apiPath + '/identity/authentication');
      authRequest.flush('token');
      const userRequest = httpMock.expectOne(environment.apiPath + '/identity/users/current/detail');
      userRequest.flush({});
      expect(service.isUserLogged()).toBeTruthy();
    });

    it('should return false if there is no current logged user', () => {
      service.logout();
      expect(service.isUserLogged()).toBe(false);
    });

    describe('currentUser streams', () => {

      beforeEach(() => {
        spyOn(httpClient, 'post').and.returnValue(of('token'));
      });

      describe('currentUserIsCandidate', () => {

        it('should return true when avatarType CANDIDATE is present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['CANDIDATE', 'PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsCandidate().subscribe(res => {
            expect(res).toBe(true);
          });
        });

        it('should return false when avatarType CANDIDATE is NOT present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsCandidate().subscribe(res => {
            expect(res).toBe(false);
          });
        });

        it('should save account info', () => {
          const RESPONSE = {};
          service.saveAccountInfo({}).subscribe(res => {
            expect(res).toBeTruthy(RESPONSE);
          });

          const request = httpMock.expectOne(
            `${environment.apiPath}/identity/users/current/account-info`
          );
          expect(request.request.method).toBe('PUT');
          request.flush(RESPONSE);
          httpMock.verify();
        });

        it('should save profile successfully', () => {
          const RESPONSE = Object.assign({ id: 999 });
          service.saveProfile(RESPONSE as Candidate).subscribe(res =>
            expect(res).toEqual(jasmine.objectContaining(RESPONSE))
          );

          const request = httpMock.expectOne(
            `${environment.apiPath}/candidates/${RESPONSE.id}`
          );
          expect(request.request.method).toBe('PUT');
          request.flush(RESPONSE);
          httpMock.verify();
        });

        it('should save residence info', () => {
          const RESPONSE = {};
          const REQUEST = { workingThroughEntity: true } as ResidenceInfo;
          service.saveResidenceInfo(REQUEST).subscribe(res => {
            expect(res).toBeTruthy(RESPONSE);
          });

          const request = httpMock.expectOne(
            `${environment.apiPath}/identity/users/current/residence-info`
          );
          expect(request.request.method).toBe('PUT');
          request.flush(RESPONSE);
          httpMock.verify();
        });

        it('should change user email', () => {
          const RESPONSE = {};
          service.changeCurrentUserEmail('email@address.com').subscribe(res => {
            expect(res).toBeTruthy(RESPONSE);
          });

          const request = httpMock.expectOne(
            `${environment.apiPath}/identity/users/current/email`
          );
          expect(request.request.method).toBe('PUT');
          request.flush(RESPONSE);
          httpMock.verify();
        });

        it('should grab current user data utilising an specified avatar type successfully', () => {
          const RESPONSE = {};

          service
          .getCurrentUserAs(AvatarTypes.Candidate)
          .subscribe(res => {
            expect(res).toBeTruthy(RESPONSE);
            const candidate = Candidate.from(Object.assign(res as CurrentUserDetail));
            expect(candidate.id).toBeUndefined();
          });

          const request = httpMock.expectOne(
            `${environment.apiPath}/identity/users/current/avatar?avatarType=${AvatarTypes.Candidate}`
          );
          expect(request.request.method).toBe('GET');
          request.flush(RESPONSE);
          httpMock.verify();
        });

        it('should get current user residence info', () => {
          const RESPONSE = {};
          service.getCurrentUserResidenceInfo().subscribe(res => {
            expect(res).toBeTruthy(RESPONSE);
          });

          const request = httpMock.expectOne(
            `${environment.apiPath}/identity/users/current/residence-info`
          );
          expect(request.request.method).toBe('GET');
          request.flush(RESPONSE);
          httpMock.verify();
        });

        it('should return false when user is null', () => {
          service.currentUserIsCandidate().subscribe(res => {
            expect(res).toBe(false);
          });
        });
      });

      describe('currentUserIsManager', () => {

        it('should return true when avatarType MANAGER is present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['MANAGER', 'PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsManager().subscribe(res => {
            expect(res).toBe(true);
          });
        });

        it('should return false when avatarType MANAGER is NOT present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsManager().subscribe(res => {
            expect(res).toBe(false);
          });
        });
      });

      describe('currentUserIsAccountManager', () => {

        it('should return true when avatarType ACCOUNT_MANAGER is present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['ACCOUNT_MANAGER', 'PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsAccountManager().subscribe(res => {
            expect(res).toBe(true);
          });
        });

        it('should return false when avatarType ACCOUNT_MANAGER is NOT present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsAccountManager().subscribe(res => {
            expect(res).toBe(false);
          });
        });
      });

      describe('currentUserIsAdmin', () => {

        it('should return true when avatarType ADMIN is present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['MANAGER', 'PERSONAL', 'ADMIN'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsAdmin().subscribe(res => {
            expect(res).toBe(true);
          });
        });

        it('should return false when avatarType ADMIN is NOT present', () => {
          const SAMPLE_RESPONSE = {
            avatarTypes: ['PERSONAL'],
          };
          spyOn(service, 'getCurrentUser')
            .and.returnValue(of(SAMPLE_RESPONSE).pipe(take(1)));
          service.currentUserIsAdmin().subscribe(res => {
            expect(res).toBe(false);
          });
        });
      });
    });
  });

  describe('changeCurrentUserPassword', () => {

    it('should delegate call the endpoint for response', () => {
      spyOn(authTokenService, 'setToken');
      const SAMPLE_OLD_PASSWORD = 'old-pass';
      const SAMPLE_NEW_PASSWORD = 'new-pass';
      const SAMPLE_RESPONSE = { token: 'sample-token' };
      service.changeCurrentUserPassword(SAMPLE_OLD_PASSWORD, SAMPLE_NEW_PASSWORD).subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBe(SAMPLE_RESPONSE.token);
      });

      const request = httpMock.expectOne(`${environment.apiPath}/identity/users/current/password`);
      expect(request.request.method).toBe('PUT');
      expect(request.request.body).toEqual({ oldPassword: SAMPLE_OLD_PASSWORD, newPassword: SAMPLE_NEW_PASSWORD });
      request.flush(SAMPLE_RESPONSE);
      httpMock.verify();
      expect(authTokenService.setToken).toHaveBeenCalledWith(SAMPLE_RESPONSE.token);
    });

  });

  describe('changeCurrentUserSecurityQuestion', () => {

    it('should delegate call the endpoint for response', () => {
      const SAMPLE_OLD_ANSWER = 'old-answer';
      const SAMPLE_NEW_QUESTION = 'new-answer';
      const SAMPLE_NEW_ANSWER = 'new-answer';
      const SAMPLE_RESPONSE: CurrentUserDetail = <CurrentUserDetail>{};
      service.changeCurrentUserSecurityQuestion(SAMPLE_OLD_ANSWER, SAMPLE_NEW_QUESTION, SAMPLE_NEW_ANSWER).subscribe(res => {
        expect(res).toEqual(SAMPLE_RESPONSE);
      });

      const mainRequest = httpMock.expectOne(`${environment.apiPath}/identity/users/current/security-question`);
      expect(mainRequest.request.method).toBe('PUT');
      mainRequest.flush({});

      const getUserRequest = httpMock.expectOne(`${environment.apiPath}/identity/users/current/detail`);
      expect(getUserRequest.request.method).toBe('GET');
      getUserRequest.flush(SAMPLE_RESPONSE);
      httpMock.verify();
    });

  });

  describe('logout', () => {

    it('should remove the item from local storage', () => {
      const removeTokenSpy = spyOn(authTokenService, 'removeToken');
      const navigateSpy = spyOn(router, 'navigateByUrl');
      service.logout();
      expect(removeTokenSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith('/');
    });

  });

  it('[verifyEmail] should return token after verifying email', () => {
    const RESPONSE = { token: 'responseToken' };
    const REQUEST = { token: 'requestToken' };
    service.verifyEmail(REQUEST.token).subscribe(res => {
      expect(res).toBeTruthy(RESPONSE);
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users?action=activate`
    );
    expect(request.request.method).toBe('POST');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('[resendActivation] should call resend activation API', () => {
    const RESPONSE = {};
    const REQUEST = { applicationId: '1' };
    service.resendActivation(REQUEST.applicationId).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users?applicationId=1&action=resendActivation`
    );
    expect(request.request.method).toBe('POST');
    request.flush(RESPONSE);
    httpMock.verify();
  });

  it('should change the user avatar successfully', () => {
    const GET_CURRENT_USER_RESPONSE = { id: 1 };
    const CHANGE_AVATAR_RESPONSE = { done: true };
    const blob = new Blob(['sample data'], { type: 'text/plain' });
    const fileName = 'sample.txt';

    spyOn(service, 'getCurrentUser')
      .and.returnValue(of(GET_CURRENT_USER_RESPONSE).pipe(take(1)));

    service.changeCurrentUserAvatar(blob, fileName)
      .subscribe(response => expect(response).toBeTruthy());

    const httpRequest = httpMock.expectOne(
      `${environment.apiPath}/identity/users/${GET_CURRENT_USER_RESPONSE.id}/image`
    );
    expect(httpRequest.request.method).toBe('POST');
    httpRequest.flush(CHANGE_AVATAR_RESPONSE);
    httpMock.verify();
  });

  // deletes an image
  it('should delete a user image successfully', () => {
    const userId = 123456;
    spyOn(service, 'deleteImage').and.callThrough();

    service.deleteImage(userId)
      .pipe(take(1))
      .subscribe(() => expect(service.deleteImage).toHaveBeenCalled());

    const entry = httpMock.expectOne(`${environment.apiPath}/identity/users/${userId}/image`);
    expect(entry.request.method).toBe('DELETE');
    entry.flush({});
    httpMock.verify();
  });

  it('should get CurrentUserDetail', () => {
    service.getCurrentUserDetail().subscribe(() => { });

    const request = httpMock.expectOne(
      environment.apiPath +
      `/identity/users/current/detail`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('[isUserManager] should return false when user is null', () => {
    spyOn(service, 'getCurrentUserValue').and.returnValue(null);
    expect(service.hasAvatarType(service.getCurrentUserValue(), AvatarTypes.Manager)).toBe(false);
  });

  it('[isUserManager] should get CurrentUserDetail', () => {
    spyOn(service, 'getCurrentUserValue').and.returnValue({
      avatarTypes: ['MANAGER'],
    });

    expect(service.hasAvatarType(service.getCurrentUserValue(), AvatarTypes.Manager)).toBe(true);
  });

  it('should get assignments for current user successfully', () => {
    service.getAssignmentsForCurrentUser().subscribe(() => { });

    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users/current/assignments`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('should get current user tasks successfully', () => {
    service.getCurrentUserTasks().subscribe(() => { });

    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users/current/tasks`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('should check email existence successfully', () => {
    const email = 'test@test.com';
    service.checkEmailExistence(email).subscribe(res => {
      expect(res).toBe(true);
    });
    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users/existence?email=${email}`
    );
    expect(request.request.method).toBe('GET');
    httpMock.verify();
  });

  it('should change current user location info successfully', () => {
    const formData = {};
    const returnData = Object.assign({});
    service
      .changeCurrentUserLocationInfo(formData)
      .subscribe(res => expect(res).toBe(returnData));
    const request = httpMock.expectOne(
      `${environment.apiPath}/identity/users/current/location`
    );
    expect(request.request.method).toBe('PUT');
    request.flush(returnData);
    httpMock.verify();
  });

  it('should update team and manager group selection', () => {
    let teamManagerGroup = {
      teams: [
        {
          id: 1
        }
      ] as Team[],
      team: {
        id: 1
      },
      managerId: 1
    };
    service.updateTeamManagerGroupSelection(teamManagerGroup);
    teamManagerGroup = {
      teams: [] as Team[],
      team: {
        id: 2
      },
      managerId: 1
    };
    service.updateTeamManagerGroupSelection(teamManagerGroup);
    expect(service.getTeamManagerGroupSelection()).toBeDefined();
  });

  it('should update team by id', () => {
    const team = {
      id: 1
    };
    service.updateTeamById(team.id);
    const teamManagerGroup = {
      teams: [
        {
          id: 1
        }
      ] as Team[],
      team: {
        id: 1
      },
      managerId: 1
    };
    service.updateTeamManagerGroupSelection(teamManagerGroup);
    service.updateTeamById(team.id);
    expect(service.getTeamManagerGroupSelection()).toBeDefined();
  });

  it('[isOwnerOrReportingManager] - should return true if manager is teamOwner or reporting manager ', () => {
    const team = {
      reportingManagers: [ {id: 1} ]
    } as Team;
    expect(service.isOwnerOrReportingManager(1, team)).toBe(true);
    expect(service.isOwnerOrReportingManager(1, null)).toBe(false);
  });

  it('[isTeamOwner] - should return true if manager is teamOwner', () => {
    const team = {
      teamOwner: {id : 1} as Manager
    } as Team;
    expect(service.isTeamOwner(1, team)).toBe(true);
    expect(service.isTeamOwner(1, {} as Team)).toBe(false);
  });

  it('should retrieve team / manager group selection info successfully', () => {
    const result = service.getTeamManagerGroupSelectionValue();

    expect(result).toEqual(null);
  });

  it('should retrieve environment timezone information successfully', async(() => {
    service.getEnvironmentTimezone()
      .subscribe(timezone => expect(timezone.timezoneOffset).toBe(new Date().getTimezoneOffset()));
  }));

  it('should patch current user information successfully', async(() => {
    const patchData = Object.assign({id: 1});
    service.patchCurrentUser(patchData);

    expect(service.getCurrentUserValue()).toEqual(jasmine.objectContaining(patchData));
  })) ;

  it('should retrieve the provided avatar ID for the current user successfully', () => {
    const avatarType = {id: 1, type: 'SAMPLE_TYPE'};
    const currentUser = { userAvatars: [avatarType] };
    spyOn(service, 'getCurrentUserValue').and.returnValue(currentUser);
    const result = service.getCurrentUserAvatarId(avatarType.type);

    expect(result).toBe(avatarType.id);
  });

  it('should check if user is an owner of a team', () => {
    const user = Object.assign({ id: 123 });
    const teamGroupSelection = Object.assign({
      team: {
        teamOwner:{
          userId: 123
        }
      }
    });
    expect(service.isUserOwnerOfTeam(user, teamGroupSelection)).toBeTruthy();
  });

  it('should check if user is not an owner of a team', () => {
    const user = Object.assign({ id: 123 });
    const teamGroupSelection = Object.assign({
      team: {
        teamOwner:{
          userId: 124
        }
      }
    });
    const teamGroupSelectionNoOwner = Object.assign({
      team: {}
    });
    expect(service.isUserOwnerOfTeam(user, teamGroupSelection)).toBeFalsy();
    expect(service.isUserOwnerOfTeam(null, teamGroupSelection)).toBeFalsy();
    expect(service.isUserOwnerOfTeam(user, teamGroupSelectionNoOwner)).toBeFalsy();
  });

  it('should check if user is an owner of a team, but not a company admin', () => {
    const teamGroupSelection = Object.assign({});
    spyOn(service, 'isUserOwnerOfTeam').and.returnValue(true);
    expect(service.isCompanyAdminOrTeamOwner(null, teamGroupSelection)).toBeTruthy();
  });

  it('should check if user is a company admin, but not an owner of a team', () => {
    const user = Object.assign({
      id: 123,
      userAvatars: [
        {type: AvatarTypes.CompanyAdmin}
      ]
    });
    const teamGroupSelection = Object.assign({});
    spyOn(service, 'isUserOwnerOfTeam').and.returnValue(false);
    expect(service.isCompanyAdminOrTeamOwner(user, teamGroupSelection)).toBeTruthy();
  });

  it('should check if user is neither a company admin nor an owner of a team', () => {
    const user = Object.assign({
      id: 123,
      userAvatars: []
    });
    const teamGroupSelection = Object.assign({});
    spyOn(service, 'isUserOwnerOfTeam').and.returnValue(false);
    expect(service.isCompanyAdminOrTeamOwner(user, teamGroupSelection)).toBeFalsy();
  });
});
