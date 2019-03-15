import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DfAlertModule, DfAlertService } from '@devfactory/ngx-df';

import { LinkedInService } from 'app/core/services/linkedin';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { LinkedinFormComponent } from 'app/shared/components/linkedin-form/linkedin-form.component';

interface DataWithButtons {
  buttons: { handler: Function }[];
}

export class DfAlertServiceMock {
  public data = [] as DataWithButtons[];

  public createAlertComponent(data: DataWithButtons): DfAlertServiceMock {
    this.data.push(data);
    return this;
  }

  public onOKClick(): boolean {
    this.data[0].buttons[0].handler();
    return true;
  }
}

export class WindowMock {
  public location = {replace: jasmine.createSpy('replace')};
}

describe('LinkedinFormComponent', () => {
  let component: LinkedinFormComponent;
  let fixture: ComponentFixture<typeof component>;

  beforeEach(() => TestBed
    .configureTestingModule({
      declarations: [
        LinkedinFormComponent,
      ],
      imports: [
        DfAlertModule.forRoot(),
      ],
      providers: [
        { provide: DfAlertService, useClass: DfAlertServiceMock},
        { provide: WINDOW_TOKEN, useFactory: () => new WindowMock() },
        { provide: HttpClient, useValue: {} },
        LinkedInService,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(LinkedinFormComponent);
      component = fixture.componentInstance;
    })
  );

  it('should be created successfully', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should display an alert when importing LinkedIn data', () => {
    const alert = component.onImport();

    alert.onOKClick();
    expect(alert).toBeTruthy();
  });
});
