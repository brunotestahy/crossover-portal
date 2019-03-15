import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DfModalService, DfToolTipDirective } from '@devfactory/ngx-df';
import { instance, mock } from 'ts-mockito';

import { WINDOW_TOKEN } from 'app/core/tokens/window.token';
import { SkypeModalComponent } from 'app/shared/components/skype-modal/skype-modal.component';

describe('SkypeModalComponent', () => {
  let component: SkypeModalComponent;
  let fixture: ComponentFixture<SkypeModalComponent>;
  let targetWindow: Window;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SkypeModalComponent],
      providers: [
        {
          provide: WINDOW_TOKEN, useValue: {
            location: {
              href: '',
            },
          },
        },
        { provide: DfModalService, useFactory: () => mock(DfModalService) },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkypeModalComponent);
    component = fixture.componentInstance;
    targetWindow = TestBed.get(WINDOW_TOKEN);
    component.skypeId = 'someId';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should open skype call prompt', () => {
    component.call();
    expect(targetWindow.location.href).toBe('skype:someId?call');
  });

  it('should open skype check prompt', () => {
    component.chat();
    expect(targetWindow.location.href).toBe('skype:someId?chat');
  });

  it('should hide modal', () => {
    component.content = instance(mock(DfToolTipDirective));
    spyOn(component.content, 'hide');
    component.hide();
    expect(component.content.hide).toHaveBeenCalled();
  });

  it('should toggle modal content state to hidden', () => {
    component.content = instance(mock(DfToolTipDirective));
    component.isVisible = true;
    spyOn(component.content, 'hide');
    component.toggle();
    expect(component.content.hide).toHaveBeenCalled();
  });

  it('should toggle modal content state to visible', () => {
    component.content = instance(mock(DfToolTipDirective));
    component.isVisible = false;
    spyOn(component.content, 'show');
    component.toggle();
    expect(component.content.show).toHaveBeenCalled();
  });

  it('should update visibility state flag when component visibility changes', () => {
    component.content = instance(mock(DfToolTipDirective));
    component.content.visibilityChange = new EventEmitter<boolean>();
    component.ngAfterViewInit();

    expect(component.isVisible).toBe(false); // value is hidden by default

    component.content.visibilityChange.emit(true);
    expect(component.isVisible).toBe(true);

    component.content.visibilityChange.emit(false);
    expect(component.isVisible).toBe(false);
  });
});
