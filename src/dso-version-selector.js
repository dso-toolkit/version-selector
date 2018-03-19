(function() {
  'use strict';

  $.ajax({
    async: false,
    global: false,
    url: '/versions.json',
    dataType: 'json'
  })
  .then(function(result) {
    var json = result.data;

    // Create input select template
    var template =  '<select id="dsoVersionSelector" class="dso-version-selector" onchange="openVersion()">' +
      json.versions
        .reduce(function (branches, item) {
          var branchLabel = item.branch || item.version.substr(0, 3) + '.x';
          var branch = branches.filter(function (r) {
            return r.label === branchLabel;
          })[0];

          if (!branch) {
            branch = {
              label: branchLabel,
              versions: []
            };

            branches.push(branch);
          }

          branch.versions.push(item);

          return branches;
        }, [])
        .reduce(function (html, branch) {
          return html + '<optgroup label="' + branch.label + '">' +
            branch.versions
              .map(function (v)  {
                return '<option value="' + v.version + '"' + (v.version === window.location.pathname.substr(1) ? ' selected' : '') + '>' + v.version + '</option>';
              })
              .join('\n') +
          '</optgroup>\n'
        }, '') +
    '</select>'

    // Insert select in .Header
    $('.Header').append(template);

    // Open correct version
    window.openVersion = function () {
      var version = $('#dsoVersionSelector').val();

      window.location.href = '/' + version;
    };
  });
})();
