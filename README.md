# hyper-gcp-status-line [![npm](https://img.shields.io/npm/v/hyper-gcp-status-line.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-gcp-status-line) [![npm](https://img.shields.io/npm/dt/hyper-gcp-status-line.svg?maxAge=86400?style=flat-square)](https://www.npmjs.com/package/hyper-gcp-status-line)

A status line plugin for [Hyper](https://hyper.is/) that shows the currently configured [Google Cloud Platform](https://cloud.google.com/) project, the [Compute Engine](https://cloud.google.com/compute/) default zone, and the [Kubernetes](https://kubernetes.io) context and namespace. It will also show the current general GCP status information as fetched from https://status.cloud.google.com/.

*N.B. in order to see the GCP status information you'll have to clone and add the plugin locally, I won't publish a new version until I know how the status page behaves during an outage.*

![hyper-gcp-statusline](https://user-images.githubusercontent.com/3009167/48733239-500fa780-ec42-11e8-92d7-cc2e8f8279a8.png "hyper-gcp-statusline")

Should work with most themes, and allow custom paths to `gcloud` and `kubectl` which are used to retrieve information.

Credits go out to [Henrik Dahl](https://github.com/henrikdahl) and his work on [hyper-statusline](https://github.com/henrikdahl/hyper-statusline). Check it out if you want a status line that shows Git information.

## Installation

Add the following to your `~/.hyper.js` config:

```javascript
module.exports = {
  ...
  plugins: ['hyper-gcp-status-line']
  ...
}
```

## Configuration

Optionally configure the below settings in `~/.hyper.js`.

### Path to `gcloud` and `kubectl`
Unless specified, `hyper-gcp-status-line` assumes binaries are installed on the global `PATH`.

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

### GCP status information refresh interval `gcloud` and `kubectl`
Unless specified, `hyper-gcp-status-line` will retrieve GCP status information from https://status.cloud.google.com/ every 10 minutes (600000 ms). Decrease at your own risk.

```javascript
module.exports = {
  config: {
    ...
      hyperGcpStatusLine: {
        timeBetweenGcpStatusChecks: 600000,

      }
    ...
  }
}
```