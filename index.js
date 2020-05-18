const { shell } = require('electron');
const { execFile } = require('child_process');
const rp = require('request-promise');
const cheerio = require('cheerio');
const color = require('color');
const path = require('path');

const configuration = {
    gcloudBinary: (process.platform === 'win32') ? 'gcloud.cmd' : 'gcloud',
    kubectlBinary: 'kubectl',
    gcpStatusUrl: 'https://status.cloud.google.com',
    timeBetweenGcpStatusChecks: 600000
};

const state = {
    gcpProject: 'n/a',
    gceDefaultZone: 'n/a',
    kubernetesContext: 'n/a',
    gcpStatus: 'n/a'
}

function setGcpProject() {
    runCommand(configuration.gcloudBinary, ['config', 'get-value', 'project']).then(project => {
        state.gcpProject = project;
    }).catch(error => {
        console.log(error.message);
        state.gcpProject = 'n/a';
    })
}

function setGceDefaultZone() {
    runCommand(configuration.gcloudBinary, ['config', 'get-value', 'compute/zone']).then(zone => {
        state.gceDefaultZone = zone;
    }).catch(error => {
        console.log(error.message);
        state.gceDefaultZone = 'n/a';
    })
}

function setKubernetesContext() {
    runCommand(configuration.kubectlBinary, ['config', 'current-context']).then(context => {
        runCommand(configuration.kubectlBinary, ['config', 'view', '--minify', '--output', 'jsonpath={..namespace}']).then(namespace => {
            state.kubernetesContext = context + ' (' + namespace + ')';
        }).catch(() => {
            state.kubernetesContext = context + ' (default)';
        })
    }).catch(error => {
        console.log(error.message);
        state.kubernetesContext = 'n/a';
    })
}

function setConfiguration() {
    setGcpProject();
    setGceDefaultZone();
    setKubernetesContext();
}

function setGcpStatus() {
    rp({ uri: configuration.gcpStatusUrl, transform: function (body) { return cheerio.load(body); }}).then(function ($) {
        state.gcpStatus = $('.status').text().trim();
    }).catch(function (error) {
        console.log(error.message);
        state.gcpStatus = 'n/a';
    })
}

function runCommand(command, options) {
    return new Promise((resolve, reject) => {
        execFile(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            if (stdout.trim() == '') {
                reject('stdout was empty');
            }
            resolve(stdout.trim());
        })
    })
}

exports.reduceUI = (state, { type, config }) => {
    switch (type) {
        case 'CONFIG_LOAD':
        case 'CONFIG_RELOAD': {
            Object.assign(configuration, config.hyperGcpStatusLine);
        }
    }

    return state;
}

exports.decorateConfig = (config) => {
    const colors = {
        foreground: config.foregroundColor || '#fff',
        background: color(config.backgroundColor || '#000').lighten(0.3).string()
    };

    let pluginBasedir = (process.platform === 'win32') ? path.join(__dirname).replace(/\\/g, '/') : __dirname

    return Object.assign({}, config, {
        css: `
            ${config.css || ''}
            .terms_terms {
                margin-bottom: 30px;
            }
            .hyper-gcp-status-line {
                display: flex;
                justify-content: flex-start;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 100;
                font-size: 12px;
                height: 30px;
                padding: 5px 0 0 10px;
                color: ${colors.foreground};
                background-color: ${colors.background};
            }
            .hyper-gcp-status-line .item {
                padding: 2px 10px 0 25px;
                cursor: default;
                overflow: hidden;
                min-width: 0;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .hyper-gcp-status-line .item:last-child {
                margin-left: auto;
            }
            .hyper-gcp-status-line .gcp-project {
                background: url(${pluginBasedir}/icons/gcp.svg) no-repeat;
            }
            .hyper-gcp-status-line .gce-default-zone {
                background: url(${pluginBasedir}/icons/gce.svg) no-repeat;
            }
            .hyper-gcp-status-line .kubernetes-context {
                background: url(${pluginBasedir}/icons/kubernetes.svg) no-repeat;
            }
            .hyper-gcp-status-line .gcp-status {
                background: url(${pluginBasedir}/icons/status.svg) no-repeat;
                cursor: pointer;
            }
        `
    })
}

exports.decorateHyper = (Hyper, { React, notify }) => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {};
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick(event) {
            shell.openExternal(configuration.gcpStatusUrl);
        }

        render() {
            const { customChildren } = this.props;
            const existingChildren = customChildren ? customChildren instanceof Array ? customChildren : [customChildren] : [];

            return (
                React.createElement(Hyper, Object.assign({}, this.props, {
                    customInnerChildren: existingChildren.concat(React.createElement('footer', { className: 'hyper-gcp-status-line' },
                        React.createElement('div', { className: 'item gcp-project', title: 'GCP project' }, this.state.gcpProject),
                        React.createElement('div', { className: 'item gce-default-zone', title: 'Compute Engine default zone' }, this.state.gceDefaultZone),
                        React.createElement('div', { className: 'item kubernetes-context', title: 'Kubernetes context and namespace' }, this.state.kubernetesContext),
                        React.createElement('div', { className: 'item gcp-status', title: 'Status information as seen on ' + configuration.gcpStatusUrl, onClick: this.handleClick }, this.state.gcpStatus)
                    ))
                }))
            );
        }

        componentDidMount() {
            // Check configuration, and kick off timer to watch for updates
            setConfiguration();
            this.repaintInterval = setInterval(() => {
                this.setState(state);
            }, 100);

            // Check GCP status, and kick off timer to do it again in the future
            setGcpStatus();
            this.pollGcpStatusInterval = setInterval(() => {
                setGcpStatus();
            }, configuration.timeBetweenGcpStatusChecks);
        }

        componentWillUnmount() {
            clearInterval(this.repaintInterval);
            clearInterval(this.pollGcpStatusInterval);
        }
    };
}

exports.middleware = (store) => (next) => (action) => {
    switch (action.type) {
        case 'SESSION_ADD_DATA':
            if (action.data.indexOf('\n') > 1) {
                setConfiguration();
            }
            break;

        case 'SESSION_SET_ACTIVE':
            setConfiguration();
            break;
    }

    next(action);
}
