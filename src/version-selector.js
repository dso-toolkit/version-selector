(function () {
  var DsoVersionSelector = {
    template:
      '<nav class="navbar navbar-right">' +
        '<ul class="nav navbar-nav">' +
          '<li style="margin-right: 8px" v-if="isLatestVersion">' +
            '<span class="dso-label navbar-text">Laatste versie</span>' +
          '</li>' +
          '<dropdown tag="li" ref="dropdown" menu-class="dso-checkable" class="navbar-text">' +
            '<button type="primary" class="btn btn-link">' +
              '<span>{{ currentVersion || \'Versies\' }}</span>' +
              '<svg class="di di-chevron-down">' +
                '<use href="/master/dso-icons.svg#chevron-down" />' +
              '</svg>' +
            '</button>' +
            '<template slot="dropdown">' +
              '<li>' +
                '<span class="dso-group-label">Versies</span>' +
              '</li>' +
              '<li v-for="version in releases" :key="version.id" class="dso-checked">' +
                '<a :href="getUrl(version)">' +
                  '{{ version.label || version.version }}' +
                '</a>' +
              '</li>' +
              '<li role="separator" class="divider"></li>' +
              '<li>' +
                '<a :href="getUrlForMaster()">' +
                  'master' +
                '</a>' +
              '</li>' +
              '<li role="separator" class="divider"></li>' +
              '<li>' +
                '<span class="dso-group-label">Branch releases</span>' +
              '</li>' +
              '<li v-for="version in topicBranches" :key="version.id">' +
                '<a :href="getUrl(version)">' +
                  '{{ version.label || version.version }}' +
                '</a>' +
              '</li>' +
            '</template>' +
          '</dropdown>' +
          '<li>' +
            '<a href="https://www.github.com/dso-toolkit/dso-toolkit" target="_blank" rel="noreferrer noopener" title="Open source code repository op GitHub">' +
              '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNTE3OEEyQTk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNTE3OEEyQjk5QTAxMUUyOUExNUJDMTA0NkE4OTA0RCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU1MTc4QTI4OTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU1MTc4QTI5OTlBMDExRTI5QTE1QkMxMDQ2QTg5MDREIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+m4QGuQAAAyRJREFUeNrEl21ojWEYx895TDPbMNlBK46IUiNmPvHBSUjaqc0H8pF5+aDUKPEBqU2NhRQpX5Rv5jWlDIWlMCv7MMSWsWwmb3tpXub4XXWdPHvc9/Gc41nu+nedc7/8r/99PffLdYdDPsvkwsgkTBwsA/PADJCnzX2gHTwBt8Hl7p537/3whn04XoDZDcpBlk+9P8AFcAghzRkJwPF4zGGw0Y9QS0mAM2AnQj77FqCzrtcwB1Hk81SYojHK4DyGuQ6mhIIrBWB9Xm7ug/6B/nZrBHBegrkFxoVGpnwBMSLR9EcEcC4qb8pP14BWcBcUgewMnF3T34VqhWMFkThLJAalwnENOAKiHpJq1FZgI2AT6HZtuxZwR9GidSHtI30jOrbawxlVX78/AbNfhHlomEUJJI89O2MqeE79T8/nk8nMBm/dK576hZgmA3cp/R4l9/UeSxiHLVIlNm4nFfT0bxyuIj7LHRTKai+zdJobwMKzcZSJb0ePV5PKN+BqAAKE47UlMnERELMM3EdYP/yrd+XYb2mOiYBiQ8OQnoRBlXrl9JZix7D1pHTazu4MoyBcnYamqAjIMTR8G4FT8LuhLsexXYYjICBiqhQBvYb6fLZIJCjPypVvaOoVAW2WcasCnL2Nq82xHJNSqlCeFcDshaPK0twkAhosjZL31QYw+1rlMpWGMArl23SBsZZO58F2tlJXmjOXS+s4WGvpMiBJT/I2PInZ6lIs9/hBsNS1hS6BG0DSqmYEDRlCXQrmy50P1oDRKTSegmNbUsA0zDMwRhPJXeCE3vWLPQMvan6X8AgIa1vcR4AkGZkDR4ejJ1UHpsaVI0g2LInpOsNFUud1rhxSV+fzC9Woz2EZkWQuja7/B+jUrgtIMpy9YCW4n4K41YfzRneW5E1KJTe4B2Zq1Q5EHEtj4U3AfEzR5SVY4l7QYQPJdN2as7RKBF0BPZqqH4VgMAMBL8Byxr7y8zCZiDlnOcEKIPmUpgB5Z2ww5RdOiiRiNajUmWda5IG6WbhsyY2fx6m8gLcoJDJFkH219M3We1+cnda93pfycZpIJEL/s/wSYADmOAwAQgdpBAAAAABJRU5ErkJggg==" alt="GitHub logo">' +
            '</a>' +
          '</li>' +
        '</ul>' +
      '</nav>',
    mounted: function () {
      var self = this;

      getVersions(function (result) {
        self.releases = result.releases;
        self.topicBranches = result.topicBranches;
        self.isLatestVersion = self.currentVersion === self.releases[0].version;
      });
    },
    methods: {
      getUrl: function (version) {
        return '/' + version.version + (this.currentComponent ? '/' + this.currentComponent : '');
      },
      getUrlForMaster: function () {
        return this.getUrl({ version: 'master' });
      }
    },
    data: function () {
      return {
        releases: [],
        topicBranches: [],
        currentVersion: getCurrentVersion(),
        currentComponent: getCurrentComponent(),
        isLatestVersion: null
      };
    }
  };

  var rootElement = document.querySelector('.toolkit-injections');
  if (!rootElement) {
    throw new Error('No rootElement');
  }
  
  var appElement = document.createElement('div');
  appElement.id = 'version-selector-app';
  
  rootElement.appendChild(appElement);

  new Vue({
    render: function (h) {
      return h(DsoVersionSelector);
    }
  }).$mount('#version-selector-app');    

  function getCurrentComponent() {
    return window.location.pathname.split('/').slice(2).join('/') || null;
  }
  
  function getCurrentVersion() {
    var version = window.location.pathname.split('/')[1] || '';
    if (version[0] === '_') {
      version = '#' + version.substr(1);
    }

    return version;
  }
  
  function getVersions(callback) {
    var versionRequest = new XMLHttpRequest();
    versionRequest.addEventListener('load', function () {
      var jsonVersions = JSON.parse(this.responseText);

      var versions = jsonVersions.versions.reduce(function (total, v) {
        if (!v.branch) {
          total.releases = [v].concat(total.releases).slice(0, 5);
        }
        else if (v.branch === 'topic') {
          total.topicBranches.push(v);
        }

        return total;
      }, { releases: [], topicBranches: [] });

      callback(versions);
    });
    versionRequest.open('GET', '/versions.json?t=' + new Date().getTime());
    versionRequest.send();
  }
})();
