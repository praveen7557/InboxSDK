var assert = require('assert');
var sinon = require('sinon');
var RSVP = require('./lib/rsvp');
var env = require('jsdom').env;
require('es6-collections');

var InboxSDK = require('./lib/inboxsdk');

describe('InboxSDK', function() {
  global.window = global.document = global.__InboxSDKImpLoader = null;
  global.MutationObserver = require('./lib/mock-mutation-observer');

  before(function() {
    return new RSVP.Promise(function(resolve, reject) {
      env('<!doctype html><html><body><div id="canvas"></div></body></html>', function (errs, _window) {
        if (errs) {
          reject(errs);
          return;
        }
        window = _window;
        document = window.document;
        document.body.classList = []; // hack
        resolve();
      });
    });
  });

  after(function() {
    window.close();
    delete global.window;
    delete global.document;
    delete global.MutationObserver;
    delete global.__InboxSDKImpLoader;
  });

  it('should load', function() {
    this.slow();
    var inboxsdk = new InboxSDK("test", {noGlobalErrorLogging: true});
    return inboxsdk._platformImplementationLoader.load();
  });
});
