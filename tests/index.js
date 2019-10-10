const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const { expect } = chai;
const { execSyncProcess } = require('../utils/common');

describe('Test commmon util functions', () => {
  describe('Assert execSyncProcess() function', () => {
    it('should return Foo Bar', () => {
      let result = execSyncProcess("echo 'Foo Bar!' ");
      expect(result).to.equal('Foo Bar!');
    });
  });
});
