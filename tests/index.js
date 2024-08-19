import { expect } from 'chai';
import { execSyncProcess } from '../utils/common';

describe('Test commmon util functions', function() {
  describe('Assert execSyncProcess() function', function() {
    it('should return Foo Bar', function() {
      let result = execSyncProcess("echo 'Foo Bar!' ");
      expect(result).to.equal('Foo Bar!');
    });
  });
});
