hyper-gcp-statusline
====================

A status line plugin for Hyper.js that shows the currently active Google Cloud Platform project and Kubernetes context.

![hyper-gcp-statusline](https://cloud.githubusercontent.com/assets/xyz "hyper-gcp-statusline")

## Install

Add the following to your `~/.hyper.js` config:

```javascript
module.exports = {
  ...
  plugins: ['hyper-gcp-statusline']
  ...
}
```

## Config

Optionally configure below options in `~/.hyper.js`.

### Default location of `gcloud`and `kubectl`
Unless specified below, `hyper-gcp-statusline` they are available through the global `PATH`.

```javascript
module.exports = {
  config: {
    ...
      hyperGcpStatusLine: {
        gcloudBinary: '/my/path/gcloud',
        kubectlBinary: '/my/path/kubectl'

      }
    ...
  }
}
```