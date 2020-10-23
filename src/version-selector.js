(function () {
  'use strict';
  var currentVersion = getCurrentVersion();
  var currentComponent = getCurrentComponent();

  // Get list of versions from versions.json
  var versionRequest = new XMLHttpRequest();
  versionRequest.addEventListener('load', createSelector);
  versionRequest.open('GET', '/versions.json?t=' + new Date().getTime());
  versionRequest.send();

  function createSelector () {
    // Create injected elements container
    var injectionsTemplate = document.createElement('div');
    injectionsTemplate.setAttribute('class', 'dso-injections');

    // Create CHANGELOG element
    var changelogAnchorElement = document.createElement('a');
    changelogAnchorElement.setAttribute('href', 'https://github.com/dso-toolkit/dso-toolkit/blob/v' + currentVersion + '/CHANGELOG.md');
    changelogAnchorElement.setAttribute('class', 'dso-changelog');
    changelogAnchorElement.innerText = 'CHANGELOG.md';

    // Create input select template
    var jsonVersions = JSON.parse(this.responseText);

    var selectTemplate = document.createElement('select');
    selectTemplate.setAttribute('id', 'dsoVersionSelector');
    selectTemplate.setAttribute('onchange', 'openVersion()');

    jsonVersions.versions.reduce(function (branches, item) {
      var branchLabel = getBranchLabel(item);
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
    .reverse()
    .forEach(function (branch) {
      var optGroup = document.createElement('optgroup');
      optGroup.setAttribute('label', branch.label);

      branch.versions.forEach(function (v) {
        var option = document.createElement('option');
        option.setAttribute('value', v.version);

        if (v.version === currentVersion) {
          option.setAttribute('selected', true);
        }

        option.appendChild(document.createTextNode(v.label || v.version));
        optGroup.appendChild(option);
      });

      selectTemplate.appendChild(optGroup);
    });

    // Create GitHub project anchor
    var githubImageElement = document.createElement('img');
    githubImageElement.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNTE3OEEyQTk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNTE3OEEyQjk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MTc4QTI4OTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1MTc4QTI5OTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m4QGuQAAAyRJREFUeNrEl21ojWEYx895TDPbMNlBK46IUiNmPvHBSUjaqc0H8pF5+aDUKPEBqU2NhRQpX5Rv5jWlDIWlMCv7MMSWsWwmb3tpXub4XXWdPHvc9/Gc41nu+nedc7/8r/99PffLdYdDPsvkwsgkTBwsA/PADJCnzX2gHTwBt8Hl7p537/3whn04XoDZDcpBlk+9P8AFcAghzRkJwPF4zGGw0Y9QS0mAM2AnQj77FqCzrtcwB1Hk81SYojHK4DyGuQ6mhIIrBWB9Xm7ug/6B/nZrBHBegrkFxoVGpnwBMSLR9EcEcC4qb8pP14BWcBcUgewMnF3T34VqhWMFkThLJAalwnENOAKiHpJq1FZgI2AT6HZtuxZwR9GidSHtI30jOrbawxlVX78/AbNfhHlomEUJJI89O2MqeE79T8/nk8nMBm/dK576hZgmA3cp/R4l9/UeSxiHLVIlNm4nFfT0bxyuIj7LHRTKai+zdJobwMKzcZSJb0ePV5PKN+BqAAKE47UlMnERELMM3EdYP/yrd+XYb2mOiYBiQ8OQnoRBlXrl9JZix7D1pHTazu4MoyBcnYamqAjIMTR8G4FT8LuhLsexXYYjICBiqhQBvYb6fLZIJCjPypVvaOoVAW2WcasCnL2Nq82xHJNSqlCeFcDshaPK0twkAhosjZL31QYw+1rlMpWGMArl23SBsZZO58F2tlJXmjOXS+s4WGvpMiBJT/I2PInZ6lIs9/hBsNS1hS6BG0DSqmYEDRlCXQrmy50P1oDRKTSegmNbUsA0zDMwRhPJXeCE3vWLPQMvan6X8AgIa1vcR4AkGZkDR4ejJ1UHpsaVI0g2LInpOsNFUud1rhxSV+fzC9Woz2EZkWQuja7/B+jUrgtIMpy9YCW4n4K41YfzRneW5E1KJTe4B2Zq1Q5EHEtj4U3AfEzR5SVY4l7QYQPJdN2as7RKBF0BPZqqH4VgMAMBL8Byxr7y8zCZiDlnOcEKIPmUpgB5Z2ww5RdOiiRiNajUmWda5IG6WbhsyY2fx6m8gLcoJDJFkH219M3We1+cnda93pfycZpIJEL/s/wSYADmOAwAQgdpBAAAAABJRU5ErkJggg==');
    githubImageElement.setAttribute('alt', 'GitHub Logo');

    var githubAnchorElement = document.createElement('a');
    githubAnchorElement.setAttribute('href', 'https://www.github.com/dso-toolkit/dso-toolkit');
    githubAnchorElement.setAttribute('title', 'DSO-Toolkit GitHub project page');
    githubAnchorElement.appendChild(githubImageElement);

    // Insert CHANGELOG link, version selector, and GitHub URL
    // injectionsTemplate.appendChild(changelogAnchorElement);
    injectionsTemplate.appendChild(selectTemplate);
    // injectionsTemplate.appendChild(githubAnchorElement);

    // Insert .dso-injections in .Header
    var header = document.querySelector('.Header') || document.querySelector('.toolkit-injections');
    header.appendChild(injectionsTemplate);

    // Open correct version
    window.openVersion = function () {
      var version = selectTemplate.options[selectTemplate.selectedIndex].value;

      window.location.href = '/' + version + '/' + currentComponent;
    };
  }

  function getCurrentVersion() {
    return window.location.pathname.split('/')[1];
  }

  function getCurrentComponent() {
    return window.location.pathname.split('/').slice(2).join('/');
  }

  function getBranchLabel(item) {
    if (item.branch) {
      if (item.branch === 'topic') {
        return 'branch';
      }

      return item.branch;
    }

    var versions = item.version.split('.');

    return versions[0] + '.' + versions[1] + '.x';
  }
})();
