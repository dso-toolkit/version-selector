(function () {
  var DsoVersionSelector = {
    template:
      '<nav class="navbar navbar-right">' +
        '<ul class="nav navbar-nav">' +
          '<li style="margin-right: 8px" v-if="isLatestVersion">' +
            '<span class="dso-label">Laatste versie</span>' +
          '</li>' +
          '<li>' +
            '<dropdown ref="dropdown" menu-class="dso-checkable">' +
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
                '<li v-for="version in releases" :key="version.id">' +
                  '<a :href="getUrl(version)">' +
                    '{{ version.label || version.version }}' +
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
