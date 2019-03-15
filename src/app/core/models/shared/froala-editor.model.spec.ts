import { FroalaEditor } from 'app/core/models/shared';

describe('FroalaEditor', () => {
  it('should initialize the object successully', () => {
    const tempValue = 'Sample';
    const instance = new FroalaEditor(true, tempValue);
    expect(instance.tempValue).toBe(tempValue);
  });

  it('should throw an error when the object is initialized', () => {
    const instance = new FroalaEditor();
    expect(() => instance.initialize())
      .toThrowError('The implementation of the initialize() method is provided by the editor code.');
  });

  it('should throw an error when the editor is retrieved', () => {
    const instance = new FroalaEditor();
    expect(() => instance.getEditor())
      .toThrowError('The implementation of the getEditor() method is provided by the editor code.');
  });

  it('should throw an error when the object is destroyed', () => {
    const instance = new FroalaEditor();
    expect(() => instance.destroy())
      .toThrowError('The implementation of the destroy() method is provided by the editor code.');
  });
});
