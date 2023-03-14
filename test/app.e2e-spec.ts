import { testObject } from '../src/models';
import { startFlow } from './startFlow';
import { blogFlow } from './blogFlow.';
import { postFlow } from './postFlow';
import { commentFlow } from './commentFlow';
import { likeFlow } from './likeFlow';

describe('AppController (e2e)', () => {
  jest.setTimeout(30000);
  const testObject: testObject = startFlow();
  //blogFlow(testObject);
  //postFlow(testObject);
  //commentFlow(testObject);
  //likeFlow(testObject);
});
