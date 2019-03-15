export class FroalaEditor {
  constructor(
    public active: boolean = false,
    public tempValue: string = ''
  ) {
  }

  public initialize(): void {
    throw new Error('The implementation of the initialize() method is provided by the editor code.');
  }

  public destroy(): void {
    throw new Error('The implementation of the destroy() method is provided by the editor code.');
  }

  public getEditor(): void {
    throw new Error('The implementation of the getEditor() method is provided by the editor code.');
  }
}
