import { App } from 'app/core/models/app/app.model';
import { Assignment } from 'app/core/models/assignment/assignment.model';
import { CandidateLanguage } from 'app/core/models/candidate/candidate-language.model';
import { CandidateSkill } from 'app/core/models/candidate/candidate-skill.model';
import { Certification } from 'app/core/models/candidate/certification.model';
import { Education } from 'app/core/models/candidate/education.model';
import { Employment } from 'app/core/models/candidate/employment.model';
import { Industry } from 'app/core/models/candidate/industry.model';
import { LinkedinConnection } from 'app/core/models/candidate/linkedin-connection.model';
import { UserAvatar } from 'app/core/models/current-user/user-avatar.model';
import { UserSecurity } from 'app/core/models/current-user/user-security.model';
import { UserLocationData } from 'app/core/models/identity/user-location-data.model';
import { Manager } from 'app/core/models/manager/manager.model';
import { BusySlot } from 'app/core/models/slot/busy-slot.model';

export class Candidate {
  public type = 'CANDIDATE';

  constructor(
    public id: number,
    public userSecurity: UserSecurity,
    public location: UserLocationData,
    public availability?: string,
    public averageRatings?: number,
    public workedHours?: number,
    public billedHours?: number,
    public industry?: Industry,
    public languages?: Array<CandidateLanguage>,
    public certifications?: Array<Certification>,
    public educations?: Array<Education>,
    public connections?: LinkedinConnection[],
    public employments?: Employment[],
    public skills?: CandidateSkill[],
    public skypeId?: string,
    public agreementAccepted?: boolean,
    public intercomId?: string,
    public personal?: boolean,
    public candidate?: boolean,
    public manager?: boolean,
    public companyAdmin?: boolean,
    public userId?: number,
    public updatedOn?: string,
    public headline?: string,
    public summary?: string,
    public email?: string,
    public firstName?: string,
    public lastName?: string,
    public createdOn?: string,
    public busySlots?: BusySlot[],
    public photoUrl?: string,
    public appFeatures?: string[],
    public avatarTypes?: string[],
    public userAvatars?: UserAvatar[],
    public infoShared?: boolean,
    public printableName?: string,
    public assignment?: Assignment,
    public applications?: { [key: string]: App[] },
    public communicationStatus?: string,
    public fullName?: string,
    public managerAvatar?: Manager
  ) {
  }

  public static from(candidate: Partial<Candidate>): Candidate {
    return new Candidate(
      candidate.id as typeof Candidate.prototype.id,
      UserSecurity.from(candidate.userSecurity || {} as UserSecurity),
      candidate.location as typeof Candidate.prototype.location,
      candidate.availability as typeof Candidate.prototype.availability,
      candidate.averageRatings as typeof Candidate.prototype.averageRatings,
      candidate.workedHours as typeof Candidate.prototype.workedHours,
      candidate.billedHours as typeof Candidate.prototype.billedHours,
      Industry.from(candidate.industry || {} as Industry),
      CandidateLanguage.fromArray(candidate.languages),
      Certification.fromArray(candidate.certifications),
      Education.fromArray(candidate.educations),
      Array.from(candidate.connections || []),
      Employment.fromArray(candidate.employments),
      CandidateSkill.fromArray(candidate.skills),
      candidate.skypeId as typeof Candidate.prototype.skypeId,
      candidate.agreementAccepted as typeof Candidate.prototype.agreementAccepted,
      candidate.intercomId as typeof Candidate.prototype.intercomId,
      candidate.personal as typeof Candidate.prototype.personal,
      candidate.candidate as typeof Candidate.prototype.candidate,
      candidate.manager as typeof Candidate.prototype.manager,
      candidate.companyAdmin as typeof Candidate.prototype.companyAdmin,
      candidate.userId as typeof Candidate.prototype.userId,
      candidate.updatedOn as typeof Candidate.prototype.updatedOn,
      candidate.headline as typeof Candidate.prototype.headline,
      candidate.summary as typeof Candidate.prototype.summary,
      candidate.email as typeof Candidate.prototype.email,
      candidate.firstName as typeof Candidate.prototype.firstName,
      candidate.lastName as typeof Candidate.prototype.lastName,
      candidate.createdOn as typeof Candidate.prototype.createdOn,
      Array.from(candidate.busySlots || []),
      candidate.photoUrl as typeof Candidate.prototype.photoUrl,
      Array.from(candidate.appFeatures || []),
      Array.from(candidate.avatarTypes || []),
      UserAvatar.fromArray(candidate.userAvatars),
      candidate.infoShared as typeof Candidate.prototype.infoShared,
      candidate.printableName as typeof Candidate.prototype.printableName
    );
  }
}
