(function() {
  'use strict';
  // Get list of versions from versions.json
  var oReq = new XMLHttpRequest();
  oReq.responseType = "json";
  oReq.addEventListener("load", createSelector);
  oReq.open("GET", "/versions.json");
  oReq.send();

  function createSelector () {
    // Create input select template
    var jsonVersions = this.response;
    var selectTemplate = document.createElement("select");
    var selectId = document.createAttribute("id");
    var selectClass = document.createAttribute("class");
    var selectOnChange = document.createAttribute("onchange");
    selectId.value = "dsoVersionSelector";
    selectClass.value = "dso-version-selector";
    selectOnChange.value = "openVersion()";
    selectTemplate.setAttributeNode(selectId);
    selectTemplate.setAttributeNode(selectClass);
    selectTemplate.setAttributeNode(selectOnChange);

    jsonVersions.versions.reduce(function (branches, item) {
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
    .forEach(function (branch) {
      var optGroup = document.createElement("optgroup");
      optGroup.setAttribute('label', branch.label);

      branch.versions
        .forEach(function (v)  {
          var option = document.createElement("option");
          option.setAttribute('value', v.version);

          if (v.version === window.location.pathname.slice(1, -1)) {
            option.setAttribute('selected', true);
          }

          option.appendChild(document.createTextNode(v.version));
          optGroup.appendChild(option);
        })

      selectTemplate.appendChild(optGroup);
    })

    // Insert select in .Header
    var header = document.querySelector(".Header");
    header.appendChild(selectTemplate);

    // Open correct version
    window.openVersion = function() {
      var version = selectTemplate.options[selectTemplate.selectedIndex].value;
      window.location.href="/" + version;
    }
  }
})();
