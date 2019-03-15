export class ApplicantQuery {
  public avatarType?: string;
  public orderBy?: string;
  public sortDir?: 'ASC' | 'DESC';
  public pageSize?: number;
  public page?: number;
  public jobId?: number | string;
}
