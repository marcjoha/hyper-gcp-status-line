# hyper-gcp-status-line [![npm](https://img.shields.io/npm/dt/hyper-gcp-status-line.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-gcp-status-line)

A status line plugin for [Hyper.js](https://hyper.is/) that shows the currently active [Google Cloud Platform](https://cloud.google.com/) project, the [Compute Engine](https://cloud.google.com/compute/) default zone, and the [Kubernetes](https://kubernetes.io) context and namespace.

![hyper-gcp-statusline](https://user-images.githubusercontent.com/3009167/48677223-92b57f00-eb71-11e8-841d-d181b15c6df4.png "hyper-gcp-statusline")

Should work with most themes, and allow custom paths to `gcloud` and `kubectl` which are used to retrieve information.

Credits go out to [Henrik Dahl](https://github.com/henrikdahl) and his work on [hyper-statusline](https://github.com/henrikdahl/hyper-statusline). Check it out if you want a status line that shows Git information.

## Installation

Add the following to your `~/.hyper.js` config:

```javascript
module.exports = {
  ...
  plugins: ['hyper-gcp-statusline']
  ...
}
```

## Configuration

Optionally configure the below settings in `~/.hyper.js`.

### Path to `gcloud` and `kubectl`
Unless specified, `hyper-gcp-statusline` assumes binaries are installed on the global `PATH`.

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