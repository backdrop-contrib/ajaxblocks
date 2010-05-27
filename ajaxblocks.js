// $Id$

/**
 * @file
 * Loads content of blocks via AJAX just after page loading, updates Drupal.settings, reattaches behaviors.
 */

if (Drupal.jsEnabled) $(document).ready(function () {
  if (typeof Drupal.settings.ajaxblocks == 'undefined') return;
  $.ajax({
    url: Drupal.settings.basePath + "ajaxblocks",
    type: "GET",
    dataType: "json",
    data: Drupal.settings.ajaxblocks,
    success: function (data) {
      // Replaces the placeholder divs by the actual block contents returned by the AJAX call,
      // executes the extra JavaScript code and attach behaviours if the apply to the blocks.
      Drupal.freezeHeight();
      for (key in data) {
        var wrapper = $('#block-' + key + '-ajax-content');
        var context = $(data[key]['content']).insertBefore(wrapper);
        wrapper.remove();
        if (data[key]['ajaxblocks_settings']) $.extend(true, Drupal.settings, data[key]['ajaxblocks_settings']);
        Drupal.attachBehaviors(context);
      }
      Drupal.unfreezeHeight();
    }
  });
});
