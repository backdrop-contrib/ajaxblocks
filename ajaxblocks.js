/**
 * @file
 * Loads content of blocks via AJAX just after page loading, updates Backdrop.settings, reattaches behaviors.
 */

(function ($) {

Backdrop.ajaxblocksSendRequest = function (request, delay) {
  if (delay) {
    setTimeout(function () { Backdrop.ajaxblocksSendRequest(request, 0); }, delay);
    return;
  }
  $.ajax({
    url: ((typeof Backdrop.settings.ajaxblocks_path !== 'undefined') ? Backdrop.settings.ajaxblocks_path : (Backdrop.settings.basePath + Backdrop.settings.pathPrefix + "ajaxblocks")),
    type: "GET",
    dataType: "json",
    data: request + '&nocache=1',
    cache: false,
    success: function (data) {
      // Replaces the placeholder divs by the actual block contents returned by the AJAX call,
      // executes the extra JavaScript code and attach behaviours if the apply to the blocks.
      Backdrop.freezeHeight();
      for (var id in data) {
        Backdrop.ajaxblocksSetBlockContent(id, data[id]);
      }
      Backdrop.unfreezeHeight();
    }
  });
};

Backdrop.ajaxblocksSetBlockContent = function (id, data) {
  if (data['delay']) {
    setTimeout(function () {data['delay'] = 0; Backdrop.ajaxblocksSetBlockContent(id, data);}, data['delay']);
    return;
  }
  var wrapper = $('#block-' + id.replace(/(\/|:|\.|\[|\]|,|=|@)/g, "\\$1") + '-ajax-content');
  if (!wrapper) {
    return;
  }
  var context = wrapper.parent();
  Backdrop.detachBehaviors(context);
  if (!context) {
    return;
  }
  context.parent().addClass('ajaxblocks-loaded');
  context.html(data['content']);
  console.log(context.val());
  if (data['ajaxblocks_settings']) {
    $.extend(true, Backdrop.settings, data['ajaxblocks_settings']);
  }
  Backdrop.attachBehaviors(context);
};

$(document).ready(function () {
  if (typeof Backdrop.settings.ajaxblocks !== 'undefined') {
    Backdrop.ajaxblocksSendRequest(Backdrop.settings.ajaxblocks, Backdrop.settings.ajaxblocks_delay);
  }
});

$(window).load(function () {
  if (typeof Backdrop.settings.ajaxblocks_late !== 'undefined') {
    Backdrop.ajaxblocksSendRequest(Backdrop.settings.ajaxblocks_late, Backdrop.settings.ajaxblocks_late_delay);
  }
});

})(jQuery);
