import { testObject } from '../src/models';
import { startFlow } from './startFlow';
import { blogFlow } from './blogFlow.';

describe('AppController (e2e)', () => {
  const testObject: testObject = startFlow();
  blogFlow(testObject);
});
