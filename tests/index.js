const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const { expect } = chai;
const { execChildProcess } = require('../utils/common');

describe('Test commmon util functions', () => {
  describe('Assert execChildProcess() function', () => {
    it('should return Hello World', () => {
      return execChildProcess({ command : "echo 'Hello World!' " }).then( (result = '') => {
        expect(result).to.equal('Hello World!');
      });
    });
  });
});
