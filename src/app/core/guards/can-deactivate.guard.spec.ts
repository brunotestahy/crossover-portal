import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { DfModalService } from '@devfactory/ngx-df';
import { mock } from 'ts-mockito/lib/ts-mockito';

import { CanDeactivateGuard } from 'app/core/guards/can-deactivate.guard';
import { HireService } from 'app/core/services/hire/hire.service';
import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { GradingPageComponent } from 'app/modules/grading/pages/grading-page/grading-page.component';

describe('CanDeactivateGuard', () => {
  let guard: CanDeactivateGuard;
  let hireService: HireService;
  let modalService: DfModalService;
  let window: Window;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
        ],
        providers: [
          CanDeactivateGuard,
          { provide: DfModalService, useFactory: () => mock(DfModalService) },
          { provide: HireService, useFactory: () => mock(HireService) },
          { provide: WINDOW_TOKEN, useValue: { location: {}, } },
        ],
      });
    })
  );

  beforeEach(() => {
    guard = TestBed.get(CanDeactivateGuard);
    hireService = TestBed.get(HireService);
    modalService = TestBed.get(DfModalService);
    window = TestBed.get(WINDOW_TOKEN);
  });

  it('should be created successfully', () =>
    expect(guard).toBeTruthy()
  );

  it('should execute can deactivate method', fakeAsync(() => {
    const component = new GradingPageComponent(modalService, hireService, window);
    spyOn(component, 'canDeactivate').and.callThrough();
    guard.canDeactivate(component);
    expect(component.canDeactivate).toHaveBeenCalled();
  }));

});
