import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  @HostBinding('class')
  public readonly classes = 'flex-grow';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  public goToSetupTrackerPage(): void {
    this.router.navigate(['..', 'setup-tracker'], { relativeTo: this.activatedRoute });
  }
}
