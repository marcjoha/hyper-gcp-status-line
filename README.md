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

Add the following to `~/.hyper.js`

### Default location to `gcloud`and `kubectl`
Unless specified below, `hyper-gcp-statusline`assumes the tools are installed in the global `PATH`.

```javascript
module.exports = {
  config: {
    ...
      hyperGcpStatusLine: {
        gcloudBinary: '/my/path/gcloud',
        kubectlBinary: '/my/path/gcloud'

      }
    ...
  }
}
```