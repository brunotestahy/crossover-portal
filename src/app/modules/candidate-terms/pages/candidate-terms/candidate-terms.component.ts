import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DocumentsService } from 'app/core/services/documents/documents.service';

@Component({
  selector: 'app-candidate-terms',
  templateUrl: './candidate-terms.component.html',
  styleUrls: ['./candidate-terms.component.scss'],
})
export class CandidateTermsComponent implements OnInit {
  public markdown$: Observable<string>;

  public form: FormGroup;

  constructor(
    private documentsService: DocumentsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.buildForm();
    this.markdown$ = this.documentsService.getCandidateTerms();
  }

  public accept(): void {
    if (this.form.valid) {
      this.router.navigate(['/signup/location']);
    }
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      accept: [false, Validators.requiredTrue],
    });
  }
}
