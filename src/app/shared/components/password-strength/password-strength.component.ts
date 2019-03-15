import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
} from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss'],
})
export class PasswordStrengthComponent implements OnChanges {

  private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];

  @Input() public passwordToCheck: string;
  @Input() public barLabel: string;

  public bar0: string;
  public bar1: string;
  public bar2: string;
  public bar3: string;
  public bar4: string;

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;
    this.setBarColors(5, '#DDD');
    /* istanbul ignore else */
    if (password) {
      const c = this.getColor(this.measureStrength(password));
      this.setBarColors(c.idx, c.col);
    }
  }

  private measureStrength(p: string): number {
    let _force = 0;
    const _regex = /[$-/:-?{-~!"^_`\[\]]/g;

    const _lowerLetters = /[a-z]+/.test(p);
    const _upperLetters = /[A-Z]+/.test(p);
    const _numbers = /[0-9]+/.test(p);
    const _symbols = _regex.test(p);

    const _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];

    let _passedMatches = 0;
    for (const _flag of _flags) {
      _passedMatches += _flag === true ? 1 : 0;
    }

    _force += 2 * p.length + (p.length >= 10 ? 1 : 0);
    _force += _passedMatches * 10;

    // penality (short password)
    _force = p.length <= 6 ? Math.min(_force, 10) : _force;

    // penality (poor variety of characters)
    _force = _passedMatches === 1 ? Math.min(_force, 10) : _force;
    _force = _passedMatches === 2 ? Math.min(_force, 20) : _force;
    _force = _passedMatches === 3 ? Math.min(_force, 40) : _force;

    return _force;
  }

  private getColor(strength: number): {
    idx: number,
    col: string
  } {
    let idx = 0;
    if (strength <= 10) {
      idx = 0;
    } else if (strength <= 20) {
      idx = 1;
    } else if (strength <= 30) {
      idx = 2;
    } else if (strength <= 40) {
      idx = 3;
    } else {
      idx = 4;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx],
    };
  }

  private setBarColors(count: number, color: string): void {
    for (let _n = 0; _n < count; _n++) {
      const key = `bar${_n}` as keyof PasswordStrengthComponent;
      this[key] = color;
    }
  }
}
