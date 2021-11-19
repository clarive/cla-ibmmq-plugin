declare var _;
declare var require;
const reg = require('cla/reg');

const rulebook = {
    moniker: 'ibmmq_rest_task',
    description: _('Executes IBM MQ REST api calls'),
    required: ['server', 'command'],
    allow: [
        'server',
        'command',
        'app_name_new',
        'project_name',
        'app_name',
        'command_options',
        'errors'
    ],
    mapper: {
        app_name_new: 'appNameNew',
        project_name: 'projectName',
        app_name: 'appName',
        command_options: 'commandOptions'
    },
    examples: [
        {
            ibmmq_rest_task: {
                command: 'new-app',
                server: 'ibmmq_server',
                project_name: 'test',
                app_name: 'test-app',
                command_options: 'ibmmq/deployment-example'
            }
        }
    ]
};

const handler = (ctx, params) => {
    const ci = require('cla/ci');
    const reg = require('cla/reg');
    const log = require('cla/log');

    const { queueManager, consoleText } = params;
    const errors = params.errors || 'fail';

    const qm = ci.load(queueManager);
    let fullUrl =
        qm.webURL() +
        '/ibmmq/rest/v1/admin/action/qmgr/' +
        qm.queueManager() +
        '/mqsc';
    fullUrl = fullUrl.replace(/([^\:])\/\//g, '$1/');
    const cmds = consoleText.split(/;?\n+/);

    var res = [];

    cmds.forEach(cmd => {
        if (!cmd) return;
        if (cmd.substring(0, 1) === '*') return;
        var output;
        try {
            output = reg.launch('service.web.rest', {
                name: _('IBM MQ REST'),
                config: {
                    accept_any_cert: 1,
                    args: null,
                    auto_parse: 1,
                    body: JSON.stringify({
                        type: 'runCommand',
                        parameters: { command: cmd }
                    }),
                    errors: 'fail',
                    headers: {
                        'ibm-mq-rest-csrf-token': 'value',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    username: qm.userName(),
                    password: qm.password(),
                    timeout: '60',
                    url: fullUrl
                }
            });
        } catch (err) {
            output = err;
        }

        if (typeof output === 'object' && output.content) {
            const code = output.content.overallCompletionCode;
            const cr = output.content.commandResponse;
            const msg = cr.map(it => it.text).join('\n');

            if (code === 0) {
                log.info(
                    `${_('IBMMQ ')} ${cmd} ${_(' task finished')}: ${msg}`,
                    output
                );
                res.push({ cmd, success: 1, message: msg });
            } else if (errors === 'return') {
                log.error(
                    `${_('IBMMQ ')} ${cmd} ${_(' task error')}: ${msg}`,
                    output
                );
                res.push({ cmd, success: 0, message: msg });
            } else {
                log.error(
                    `${_('IBMMQ ')} ${cmd} ${_(' task error')}: ${msg}`,
                    output
                );
                throw new Error(
                    'IBM MQ Error for command ' + cmd + ': ' + msg + '\n'
                );
            }
        } else if (errors === 'return') {
            log.error(`${_('IBMMQ ')} ${cmd} ${_(' task error')}: ${output}`);
            res.push({
                cmd,
                success: 0,
                message: 'Invalid response from REST api ' + output
            });
        } else {
            log.error(`${_('IBMMQ ')} ${cmd} ${_(' task error')}: ${output}`);
            throw new Error('Invalid response from REST api ' + output);
        }
    });

    return res.length === 1 ? res[0] : res;
};

reg.register('service.ibmmq.queue.create', {
    name: _('IBM MQ Create Queue'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText:
            "DEFINE QLOCAL(MYQUEUE) DEFPSIST(YES) DESCR('Queue created from Clarive')"
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.queue.delete', {
    name: _('IBM MQ Delete Queue'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'DELETE QLOCAL (MYQUEUE) NOPURGE'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.queue.display', {
    name: _('IBM MQ Display Queue'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'DISPLAY QUEUE(MYQUEUE)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.alias.create', {
    name: _('IBM MQ Create Alias'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'DEFINE QALIAS(MYALIAS) TARGET(MYQUEUE)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.channel.create', {
    name: _('IBM MQ Create Channel'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'DEFINE CHANNEL(MYCHANNEL) CHLTYPE(SVRCONN)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.channel.start', {
    name: _('IBM MQ Start a Channel'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'START CHANNEL(MYCHANNEL)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.channel.stop', {
    name: _('IBM MQ Start a Channel'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'STOP CHANNEL(MYCHANNEL) MODE(FORCE)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.security.refresh', {
    name: _('IBM MQ Grant Security'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText: 'REFRESH SECURITY TYPE(CONNAUTH)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.auth.grant', {
    name: _('IBM MQ Grant PUT,GET'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    data: {
        consoleText:
            'SET AUTHREC PROFILE (MYQUEUE) OBJTYPE (QUEUE) PRINCIPAL(MYUSER) AUTHADD(PUT,GET)'
    },
    rulebook,
    handler
});

reg.register('service.ibmmq.rest', {
    name: _('IBM MQ Console REST'),
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    form: '/plugin/cla-ibmmq-plugin/form/ibmmq-rest.js',
    rulebook,
    handler
});
