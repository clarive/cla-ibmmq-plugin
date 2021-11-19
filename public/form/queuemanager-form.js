(function(params) {

    var webURLTextField = Cla.ui.textField({
        name: 'webURL',
        fieldLabel: _('IBM Web Console URL'),
        allowBlank: false
    });

    var queueManagerTextField = Cla.ui.textField({
        name: 'queueManager',
        fieldLabel: _('Queue Manager'),
        allowBlank: false
    });

    var loginCheckBox = Cla.ui.checkBox({
        name: 'tokenLogin',
        fieldLabel: _('Token login?'),
        checked: params.rec.tokenLogin || false
    });

    loginCheckBox.on('check', function() {
        var v = loginCheckBox.checked;
        if (v) {
            tokenTextField.show();
            userTexfield.hide();
            passTextfield.hide();
            tokenTextField.allowBlank = false;
            userTexfield.allowBlank = true;
            passTextfield.allowBlank = true;
        } else {
            tokenTextField.hide();
            userTexfield.show();
            passTextfield.show();
            tokenTextField.allowBlank = true;
            userTexfield.allowBlank = false;
            passTextfield.allowBlank = false;
        }
    });

    var userTexfield = Cla.ui.textField({
        name: 'userName',
        fieldLabel: _('Username'),
        allowBlank: false,
        hidden: !(loginCheckBox.checked != 1)
    });
    var passTextfield = Cla.ui.textField({
        name: 'password',
        fieldLabel: _('Password'),
        allowBlank: false,
        inputType: 'password'
    });
    var tokenTextField = Cla.ui.textField({
        name: 'authToken',
        fieldLabel: _('Authentication Token'),
        allowBlank: !(loginCheckBox.checked == 1),
        hidden: !(loginCheckBox.checked == 1)
    });
    var cliPathTextField = Cla.ui.textField({
        name: 'cliPath',
        value: params.rec.cliPath || "",
        fieldLabel: _('Command-line path (prepended to commands such as setmqaut)'),
        allowBlank: true
    });


    return [
        webURLTextField,
        queueManagerTextField,
        loginCheckBox,
        userTexfield,
        passTextfield,
        tokenTextField,
        cliPathTextField
    ]
})

