(function (params) {
    var data = params.data || {};

    var serverComboBox = Cla.ui.ciCombo({
        name: 'queueManager',
        class: 'MQQueueManager',
        fieldLabel: _('Queue Manager'),
        value: params.data.queueManager || '',
        width: 400,
        allowBlank: false,
        with_vars: 1
    });

    var consoleText = Cla.ui.codeEditor({
        name: 'consoleText',
        fieldLabel: _('Console Text'),
        value: params.data.consoleText || params.data.config.console_text,
        height: 300,
        allowBlank: false
    });

    var errors = Cla.ui.comboBox({
        name: 'errors',
        fieldLabel: 'Error Handling',
        data: [
            ['fail', _('Fail on error')],
            ['return', _('Return error and continue')]
        ],
        value: params.data.errors || 'fail',
        allowBlank: false,
        anchor: '100%',
        singleMode: true
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [serverComboBox, errors, consoleText]
    });

    return panel;
});
