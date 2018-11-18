const { execFile } = require('child_process');

/*
todo:
- fixa css och ikoner
- screenshot
- paketering
- twittra
*/

let configuration = {
    gcloudBinary: 'gcloud',
    kubectlBinary: 'kubectl'
};

let status = {
    gcp: 'n/a',
    kubernetes: 'n/a'
}

function setStatusGcp() {
    runCommand(configuration.gcloudBinary, ['config', 'get-value', 'project']).then(project => {
        status.gcp = project;
    }).catch(() => {
        status.gcp = 'n/a';
    })
}

function setStatusKubernetes() {
    runCommand(configuration.kubectlBinary, ['config', 'current-context']).then(context => {
        runCommand(configuration.kubectlBinary, ['config', 'view', '--minify', '--output', 'jsonpath={..namespace}']).then(namespace => {
            status.kubernetes = context + ":" + namespace;
        }).catch(() => {
            status.kubernetes = context + ":default";
        })
    }).catch(() => {
        status.kubernetes = 'n/a';
    })
}

function runCommand(command, options) {
    return new Promise((resolve, reject) => {
        execFile(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(`${error}\n${stderr}`)
            }
            if (stdout.trim() == "") {
                reject("stdout was empty");
            }
            resolve(stdout.trim())
        })
    })
}

exports.reduceUI = (state, { type, config }) => {
    switch (type) {
        case 'CONFIG_LOAD':
        case 'CONFIG_RELOAD': {
            configuration = Object.assign(configuration, config.hyperGcpStatusLine);
        }
    }

    return state
}

exports.decorateHyper = (Hyper, { React }) => {
    return class extends React.PureComponent {
        constructor(props) {
            super(props);
            this.state = {};
        }

        render() {
            const { customChildren } = this.props
            const existingChildren = customChildren ? customChildren instanceof Array ? customChildren : [customChildren] : [];

            return (
                React.createElement(Hyper, Object.assign({}, this.props, {
                    customInnerChildren: existingChildren.concat(React.createElement('div', { className: 'hyper-gcp-status-line' },
                        React.createElement('div', { className: 'item gcp' }, this.state.gcp),
                        React.createElement('div', { className: 'item kubernetes' }, this.state.kubernetes)
                    ))
                }))
            );
        }

        componentDidMount() {
            this.interval = setInterval(() => {
                this.setState(status);
            }, 100);
        }

        componentWillUnmount() {
            clearInterval(this.interval);
        }
    };
}

exports.middleware = (store) => (next) => (action) => {
    switch (action.type) {
        case 'SESSION_ADD_DATA':
            const { data } = action;
            if (data.indexOf('\n') > 1) {
                setStatusGcp();
                setStatusKubernetes();
            }
            break;

        case 'SESSION_SET_ACTIVE':
            setStatusGcp();
            setStatusKubernetes();
            break;
    }

    next(action);
}