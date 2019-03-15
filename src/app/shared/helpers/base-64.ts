/* tslint:disable */
export class Base64 {

  private static readonly detect =
      /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

  private static readonly validChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  public static atob(targetWindow: Partial<Window>, input: string) {
    if (targetWindow.atob) {
      return targetWindow.atob(input);
    }
    let data = String(input).replace(/[\t\n\f\r ]+/g, '');
    if (!Base64.detect.test(data)) {
      throw new TypeError(
        'Failed to execute "atob" on "Window": The string to be decoded is not correctly encoded.'
      );
    }

    data += '=='.slice(2 - (data.length & 3));
    let bitmap, result = '', r1, r2, i = 0;

    for (; i < data.length;) {
      bitmap = Base64.validChars.indexOf(data.charAt(i++)) << 18 |
        Base64.validChars.indexOf(data.charAt(i++)) << 12 |
        (r1 = Base64.validChars.indexOf(data.charAt(i++))) << 6 |
        (r2 = Base64.validChars.indexOf(data.charAt(i++)));

      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
              : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
              : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }

    return result;
  }
}
