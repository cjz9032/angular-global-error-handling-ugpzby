import { SafeDomPipe } from './safe-dom.pipe';

describe('SafeDomPipe', () => {
  it('create an instance', () => {
    // @ts-ignore
	  const pipe = new SafeDomPipe();
    expect(pipe).toBeTruthy();
  });
});
