# version-selector
_This is only used until `dso-toolkit@11.2.0`. Starting from `dso-toolkit@11.2.1` the version selector is part of the theme used by the Fractal instance in `dso-toolkit`_

The on-request-time injected version selector at www.dso-toolkit.nl

`version-selector.js` and `version-selector.css` files are injected into each .html file at request-time. Versions are maintained within an adjacent `versions.json`:

```
{
  "versions": [
    {
      "version": "1.0.0",
      "branch": "unstable"
    }
  ]
}
```

Versions are grouped by semver's minor increment unless a property "branch" is set.

# Warning
Ugly code ahead, we needed a minimal solution