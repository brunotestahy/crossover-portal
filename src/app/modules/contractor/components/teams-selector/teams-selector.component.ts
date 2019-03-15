import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from 'app/core/models/team';

@Component({
  selector: 'app-teams-selector',
  templateUrl: './teams-selector.component.html',
  styleUrls: ['./teams-selector.component.scss'],
})
export class TeamsSelectorComponent implements OnInit {
  protected _teams: Team[] = [];
  @Input()
  public get teams(): Team[] {
    return this._teams;
  }
  public set teams(value: Team[]) {
    this._teams = value;
    this.selectedTeamsIds = [];
    this._teams.forEach(team => this.selectedTeamsIds.push(team.id));
    this.change.emit(this.selectedTeamsIds);
  }
  @Output() public change: EventEmitter<number[]> = new EventEmitter<number[]>();

  public selectedTeamsIds: number[] = [];
  public nameSearch: string = '';

  public assignmentsPerTeam: number = 3;

  constructor() {}

  ngOnInit(): void {}

  public toggleTeamSelection(team: Team): void {
    const indexLookup: number = this.selectedTeamsIds.indexOf(team.id);
    if (indexLookup < 0) {
      this.selectedTeamsIds.push(team.id);
    } else {
      this.selectedTeamsIds.splice(indexLookup, 1);
    }
    this.change.emit(this.selectedTeamsIds);
  }

  public toggleTeamSelectionAll(): void {
    if (this.selectedTeamsIds.length > 0) {
      this.selectedTeamsIds = [];
    } else {
      this.teams.forEach(team => this.selectedTeamsIds.push(team.id));
    }
    this.change.emit(this.selectedTeamsIds);
  }
}
