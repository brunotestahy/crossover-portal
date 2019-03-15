import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { empty } from 'rxjs/observable/empty';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators/switchMap';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { sprintf } from 'sprintf-js';

import * as AvatarTypes from 'app/core/constants/avatar-types';
import { ErrorCodes } from 'app/core/constants/http/error-codes';
import { Assignment } from 'app/core/models/assignment';
import { AuthenticationResponse } from 'app/core/models/authentication-response';
import { Candidate } from 'app/core/models/candidate';
import { UserAvatar } from 'app/core/models/current-user';
import { CurrentUserDetail, EnvironmentTimezone, Token } from 'app/core/models/identity';
import { ResidenceInfo } from 'app/core/models/residence-info';
import { Task } from 'app/core/models/task';
import { Team, TeamManagerGroup } from 'app/core/models/team';
import { AuthTokenService } from 'app/core/services/auth-token/auth-token.service';
import { isDefined } from 'app/core/type-guards/is-defined';
import { environment } from 'environments/environment';

const URLs = {
  forgotPassword: `${environment.apiPath}/identity/users/?action=reset`,
  updatePassword: `${environment.apiPath}/identity/users/?action=updatePassword`,
  confirmForgotPasswordToken: `${environment.apiPath}/identity/users/?action=confirmToken`,
  authentication: `${environment.apiPath}/identity/authentication`,
  currentUser: `${environment.apiPath}/identity/users/current`,
  userPhoto: `${environment.apiPath}/identity/users/%(id)s/image`,
  deletePhoto: `${environment.apiPath}/identity/users/%(userId)s/image`,
  residenceInfo: `${environment.apiPath}/identity/users/current/residence-info`,
  saveResidenceInfo: `${environment.apiPath}/identity/users/current/residence-info`,
  saveCurrentUser: `${environment.apiPath}/identity/users/current/account-info`,
  changeCurrentUserLocation: `${environment.apiPath}/identity/users/current/location`,
  currentUserAvatar: `${environment.apiPath}/identity/users/current/avatar`,
  updateUserAvatars: `${environment.apiPath}/identity/users/%(candidateId)s/avatars`,
  currentUserTasks: `${environment.apiPath}/identity/users/current/tasks`,
  currentUserDetail: `${environment.apiPath}/identity/users/current/detail`,
  changeCurrentUserEmail: `${environment.apiPath}/identity/users/current/email`,
  changeCurrentUserPassword: `${environment.apiPath}/identity/users/current/password`,
  changeCurrentUserSecurityQuestion: `${environment.apiPath}/identity/users/current/security-question`,
  candidateProfile: `${environment.apiPath}/identity/users/current`,
  currentUserAssignments: `${environment.apiPath}/identity/users/current/assignments`,
  verifyEmail: `${environment.apiPath}/identity/users?action=activate`,
  resendActivation: `${environment.apiPath}/identity/users`,
  emailExistence: `${environment.apiPath}/identity/users/existence`,
  store: `${environment.apiPath}/candidates/%(candidateId)s`,
};

export interface ConfirmForgotPasswordTokenResponse {
  securityQuestion: string;
  linkedInLogin: boolean;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export interface UpdatePasswordRequest {
  passwordResetToken: string;
  rawPassword: string;
  securityQuestion: string;
  securityQuestionAnswer: string;
}

@Injectable()
export class IdentityService {

  private teamManagerGroupSelection$ = new BehaviorSubject<TeamManagerGroup | null>(null);
  /**
   * IMPORTANT: Any operation that does modifies the currentUser$ should update it
   *  check for example changeCurrentUserSecurityQuestion()
   *  If you fail to do that you will be holding the old data after the operation.
   */
  protected currentUser$ = new BehaviorSubject<CurrentUserDetail | null>(null);

  constructor(
    private http: HttpClient,
    private authTokenService: AuthTokenService,
    private router: Router,
  ) {
  }

  public getTeamManagerGroupSelection(): Observable<TeamManagerGroup | null> {
    return this.teamManagerGroupSelection$.asObservable();
  }

  public getTeamManagerGroupSelectionValue(): TeamManagerGroup | null {
    return this.teamManagerGroupSelection$.getValue();
  }

  public updateTeamManagerGroupSelection(teamManagerGroup: TeamManagerGroup | null): void {
    const teamManagerGroupSelection = this.teamManagerGroupSelection$.getValue();
    if (
      teamManagerGroupSelection &&
      teamManagerGroupSelection.teams &&
      teamManagerGroup &&
      (!teamManagerGroup.teams || teamManagerGroup.teams.length === 0)
    ) {
      teamManagerGroup.teams = teamManagerGroupSelection.teams;
    }
    this.teamManagerGroupSelection$.next(teamManagerGroup as TeamManagerGroup);
  }

  public clearTeamManagerGroupSelection(): void {
    this.teamManagerGroupSelection$.next({} as TeamManagerGroup);
  }

  public updateTeamById(teamId: number): void {
    const teamManagerGroupSelection = this.teamManagerGroupSelection$.getValue();
    if (
      teamManagerGroupSelection &&
      teamManagerGroupSelection.teams
     ) {
      const team = _.defaultTo(
        teamManagerGroupSelection.teams.filter(entry => entry.id === teamId)[0],
        {} as Team
      );
      teamManagerGroupSelection.team = team;
      this.teamManagerGroupSelection$.next(teamManagerGroupSelection as TeamManagerGroup);
    }
  }

  public forgotPassword(formData: { email: string }): Observable<void> {
    return this.http.post<void>(URLs.forgotPassword, null, {
      params: { email: formData.email },
    });
  }

  public updatePassword(formData: UpdatePasswordRequest): Observable<void> {
    return this.http.put<void>(URLs.updatePassword, formData, {
      params: { userToken: formData.passwordResetToken },
    });
  }

  public confirmForgotPasswordToken(passwordResetToken: string): Observable<ConfirmForgotPasswordTokenResponse> {
    return this.http.get<ConfirmForgotPasswordTokenResponse>(
      URLs.confirmForgotPasswordToken,
      { params: { passwordResetToken } },
    );
  }

  public login(email: string, password: string): Observable<CurrentUserDetail> {
    return this.http
      .post<AuthenticationResponse>(URLs.authentication, null, {
        headers: { Authorization: 'Basic ' + btoa(email + ':' + password) },
      })
      .pipe(
        map(authResponse => authResponse.token),
        switchMap((token) => this.loginWithToken(token) as Observable<CurrentUserDetail>),
      );
  }

  public checkEmailExistence(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${URLs.emailExistence}?email=${email}`);
  }

  public loginWithToken(token: string): Observable<CurrentUserDetail> {
    this.authTokenService.setToken(token);
    return this.requestCurrentUser().pipe(
      // emits user into the currentUser stream
      tap(userResponse => this.currentUser$.next(userResponse)),
      catchError((err: HttpErrorResponse) => {
        if (err.status === ErrorCodes.Unauthorized) {
          this.currentUser$.next(null);
        }
        return empty();
      }),
      // returns current user stream
      switchMap(() => this.getCurrentUser() as Observable<CurrentUserDetail>),
    );
  }

  public isUserLogged(): boolean {
    return !!this.getCurrentUserValue();
  }

  public getCurrentUserValue(): CurrentUserDetail | null {
    return this.currentUser$.getValue();
  }

  public getCurrentUser(): Observable<CurrentUserDetail | null> {
    return this.currentUser$.asObservable();
  }

  public getCurrentUserAvatarId(type: string): number | null {
    const currentUser = this.getCurrentUserValue();
    const avatarTypes = _.get(currentUser, 'userAvatars', []) as UserAvatar[];
    return _.defaultTo(
      avatarTypes
        .filter(avatarType => avatarType.type === type)
        .map(avatarType => avatarType.id)[0],
      null,
    );
  }

  public getCurrentUserAs(avatarType: string): Observable<CurrentUserDetail | null> {
    return this.http.get<CurrentUserDetail | null>(URLs.currentUserAvatar, {
      params: { avatarType },
    }).pipe(take(1));
  }

  public currentUserIsCandidate(): Observable<boolean> {
    return this.currentUserIs(AvatarTypes.Candidate);
  }

  public currentUserIsManager(): Observable<boolean> {
    return this.currentUserIs(AvatarTypes.Manager);
  }

  public currentUserIsAccountManager(): Observable<boolean> {
    return this.currentUserIs(AvatarTypes.AccountManager);
  }

  public currentUserIsAdmin(): Observable<boolean> {
    return this.currentUserIs(AvatarTypes.Admin);
  }

  public saveAccountInfo(accountInfo: { firstName?: string; lastName?: string; }): Observable<CurrentUserDetail> {
    return this.http.put<CurrentUserDetail>(URLs.saveCurrentUser, accountInfo)
      .pipe(tap(response => this.currentUser$.next(response)));
  }

  public saveProfile(candidate: Candidate): Observable<Candidate> {
    const candidateId = candidate.id;
    return this.http
      .put<Candidate>(sprintf(URLs.store, { candidateId }), candidate);
  }

  public saveResidenceInfo(residenceInfo: ResidenceInfo): Observable<ResidenceInfo> {
    return this.http.put<ResidenceInfo>(URLs.saveResidenceInfo, residenceInfo);
  }

  public changeCurrentUserEmail(email: string): Observable<void> {
    return this.http.put<void>(URLs.changeCurrentUserEmail, email);
  }

  public changeCurrentUserLocationInfo(formData: { [key: string]: string }): Observable<void> {
    return this.http.put<void>(URLs.changeCurrentUserLocation, formData);
  }

  public changeCurrentUserPassword(oldPassword: string, newPassword: string): Observable<string> {
    return this.http.put<Token>(URLs.changeCurrentUserPassword,
      { oldPassword: oldPassword, newPassword: newPassword }).pipe(
      // The password change does altear the session token
      map(authResponse => authResponse.token),
      tap(token => this.authTokenService.setToken(token)),
    );
  }

  public changeCurrentUserSecurityQuestion(oldAnswer: string, newQuestion: string, newAnswer: string): Observable<CurrentUserDetail> {
    return this.http.put<void>(URLs.changeCurrentUserSecurityQuestion, { oldAnswer, newQuestion, newAnswer })
    // We should update the current user
      .pipe(switchMap(() => this.requestCurrentUser()));
  }

  public getCurrentUserResidenceInfo(): Observable<ResidenceInfo> {
    return this.http.get<ResidenceInfo>(URLs.residenceInfo);
  }

  public getEnvironmentTimezone(): Observable<EnvironmentTimezone> {
    return Observable.of(new EnvironmentTimezone(
      new Date().getTimezoneOffset(),
    ));
  }

  public logout(): void {
    this.authTokenService.removeToken();
    this.currentUser$.next(null);
    this.router.navigateByUrl('/');
  }

  public getAssignmentsForCurrentUser(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(URLs.currentUserAssignments);
  }

  public verifyEmail(token: string): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(URLs.verifyEmail, { token: token })
      .pipe(
        map((response) => {
          return <AuthenticationResponse>{
            token: response.token,
          };
        }),
      );
  }

  public resendActivation(applicationId: string): Observable<void> {
    return this.http.post<void>(
      URLs.resendActivation,
      {},
      {
        params: new HttpParams({
          fromObject: {
            applicationId: applicationId,
            action: 'resendActivation',
          },
        }),
      },
    );
  }

  public changeCurrentUserAvatar(avatar: Blob, fileName: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('image', avatar, fileName);
    return this.getCurrentUser()
      .pipe(
        filter(isDefined),
        take(1),
        switchMap(user =>
          this.http.post<string>(
            sprintf(URLs.userPhoto, { id: user.id }),
            formData,
          ),
        ),
      );
  }

  public deleteImage(userId: number): Observable<void> {
    return this.http
      .delete<void>(sprintf(URLs.deletePhoto, { userId }));
  }

  public getCurrentUserTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(URLs.currentUserTasks);
  }

  public patchCurrentUser(data: Partial<CurrentUserDetail> | null): void {
    const updatedUserData = { ...this.getCurrentUserValue(), ...data };
    this.currentUser$.next(updatedUserData as CurrentUserDetail);
  }

  public getCurrentUserDetail(): Observable<CurrentUserDetail> {
    return this.http.get<CurrentUserDetail>(URLs.currentUserDetail);
  }

  public hasAvatarType(user: CurrentUserDetail | null, type: string): boolean {
    return !!user && !!user.avatarTypes &&
      user.avatarTypes.find(avatarType => avatarType === type) !== undefined;
  }

  public updateUserAvatars(candidateId: number, avatars: string[]): Observable<void> {
    const queryString: string = avatars.reduce((avatar1, avatar2) => `${avatar1}&avatars=${avatar2}`, '?');
    return this.http.put<void>(`${sprintf(URLs.updateUserAvatars, { candidateId })}${queryString}`, {
      avatars,
      id: candidateId,
    });
  }

  public isOwnerOrReportingManager(userId: number, team: Team | null): boolean {
    return !!team &&
      (
        (team.teamOwner && team.teamOwner.id === userId) ||
        (Array.isArray(team.reportingManagers) && team.reportingManagers.some(manager => manager.id === userId))
      );
  }

  public isTeamOwner(userId: number, team: Team): boolean {
    return !!team && !!team.teamOwner && team.teamOwner.id === userId;
  }

  public isCompanyAdminOrTeamOwner(
    user: CurrentUserDetail | null,
    teamGroupSelection: TeamManagerGroup
  ): boolean {
    const isCompanyAdmin = this.isCompanyAdmin(user);
    const isTeamOwner = this.isUserOwnerOfTeam(user, teamGroupSelection);
    return isCompanyAdmin || isTeamOwner;
  }

  public isUserOwnerOfTeam(
    user: CurrentUserDetail | null,
    teamGroupSelection: TeamManagerGroup
  ): boolean {
    return !!user &&
      !!teamGroupSelection.team.teamOwner &&
      teamGroupSelection.team.teamOwner.userId === user.id;
  }

  protected requestCurrentUser(): Observable<CurrentUserDetail> {
    return this.getCurrentUserDetail().pipe(
      tap((userResponse: CurrentUserDetail) => {
        this.currentUser$.next(userResponse);
      }),
    );
  }

  protected currentUserIs(type: string): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => this.hasAvatarType(user, type)),
    );
  }

  private isCompanyAdmin(user: CurrentUserDetail | null): boolean {
    return !!user
      && user.userAvatars.some(avatar => avatar.type === AvatarTypes.CompanyAdmin);
  }
}
