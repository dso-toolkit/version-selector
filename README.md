# version-selector
The on-request-time injected version selector at www.dso-toolkit.nl

# Usage
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