/*globals najax, FastBoot, Ember*/
var nodeAjax = function(url, type, options) {
  var adapter = this;

  return new Ember.RSVP.Promise(function(resolve, reject) {
    var hash = adapter.ajaxOptions(url, type, options);

    hash.success = function(json, textStatus, jqXHR) {
      // TODO: Resolve the hard coded success values below
      var statusCode = 200; // textStatus is null in Fastboot
      var headers = ''; // jqXHR is undefined in Fastboot
      json = adapter.handleResponse(statusCode, headers, json);
      Ember.run(null, resolve, json);
    };

    hash.error = function(jqXHR, textStatus, errorThrown) {
      Ember.run(null, reject, adapter.ajaxError(jqXHR, jqXHR.responseText, errorThrown));
    };

    najax(hash);
  }, 'DS: RESTAdapter#ajax ' + type + ' to ' + url);
};

export default {
  name: 'ajax-service',

  initialize: function(application) {
    // Detect if we're running in Node. If not, there's nothing to do.
    if (typeof document === 'undefined') {
      application.register('ajax:node', {
        create: function() {
          return nodeAjax;
        }
      });

      application.inject('adapter', 'ajax', 'ajax:node');
    }
  }
};
