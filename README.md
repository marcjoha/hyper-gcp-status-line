hyper-gcp-statusline
====================

A status line plugin for [Hyper.js](https://hyper.is/) that shows the currently active [Google Cloud Platform](https://cloud.google.com/) project and (Kubernetes)[https://kubernetes.io] context.

![hyper-gcp-statusline](https://user-images.githubusercontent.com/3009167/48673267-076fc580-eb40-11e8-95f7-cfa4b3b4d345.png "hyper-gcp-statusline")

Should work with most themes, and allow custom paths to `gcloud` and `kubectl` which are used to retrieve information.

Credits go out to (Henrik Dahl)[https://github.com/henrikdahl] and his work on (hyper-statusline)[https://github.com/henrikdahl/hyper-statusline]. Make sure to check out his work if you want a status line that shows Git information.

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

### Default location of `gcloud`and `kubectl`
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