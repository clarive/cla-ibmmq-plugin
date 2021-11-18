const ci = require('cla/ci');

ci.createRole('IBMMQ');

ci.createClass('MQQueueManager', {
    form: '/plugin/cla-ibmmq-plugin/form/queuemanager-form.js',
    icon: '/plugin/cla-ibmmq-plugin/icon/ibmmq.png',
    roles: ['IBMMQ', 'ClariveSE'],
    has: {
        webURL: {
            is: 'rw',
            isa: 'Str',
            required: true
        },
        queueManager: {
            is: 'rw',
            isa: 'Str',
            required: true
        },
        userName: {
            is: 'rw',
            isa: 'Str',
            required: false
        },
        password: {
            is: 'rw',
            isa: 'Str',
            required: false
        },
        tokenLogin: {
            is: 'rw',
            isa: 'Bool',
            required: true
        },
        authToken: {
            is: 'rw',
            isa: 'Str',
            required: false
        },
        cliPath: {
            is: 'rw',
            isa: 'Str',
            required: false
        }
    }
});
