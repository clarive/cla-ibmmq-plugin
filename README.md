# IBM MQ

<img src="https://cdn.rawgit.com/clarive/cla-ibmmq-plugin/master/public/icon/ibmmq.svg?sanitize=true" alt="IBM MQ Plugin" title="IBM MQ Plugin" width="120" height="120">

The IBM MQ plugin will allow you to interact with the IBM MQSC console
to run any console commands available through the IBM MQ rest interface.

## Requirements

This plugin requires Clarive 7.8 or greater
and IBM MQ 6 or greater.

## Installation

To install the plugin, place the `cla-ibmmq-plugin` folder inside the
`$CLARIVE_BASE/plugins` directory in a Clarive instance.

## Implementation

1. Setup at least one IBM MQ Server (`MQQueueManager`) resource. This is the
   IBM MQ server Clarive will interact with.

2. Use the one or more of the IBM MQ ops in any desired rule (a job,
   form, independent, webservice or event trigger).

### IBM MQ Queue Manager Resource

This configuration item holds the URL and token or credentials to
access a given IBM MQ REST server endpoint.

The various parameters are:

- **IBM Web Console URL** - the server endpoint URL, ie.
  `https://[IBMMQIP]:9443`
- **Queue Manager** - the name of the queue server being used.  If unchecked,
  it will use username/password to login (not recommended).
- **Token login?** - check this if you are using a token to login to the
  server.  If unchecked, it will use username/password to login (not
  recommended).
- **Username/Password** - IBM MQ server user and password in case basic
  authentication is being used.
- **Authentication token** - the IBM MQ token to use for login, if Token login
  was selected.

**Important** make sure to give the IBM MQ user Web API permissions, otherwise
the REST calls will be refused with a 401/402 status code.

## Available ops:

All IBM MQ ops use the MQSC console facility through the
REST interface. This means virtually all IBM MQ operations
are available through Clarive.

- `IBM MQ Console REST` - this is the generic console command
REST op. Any console command can be sent through this.

The rest of ops are actually just templates to get you started,
but can be customized with any IBM MQ console command:

- `IBM MQ Create Queue`
- `IBM MQ Delete Queue`
- `IBM MQ Display Queue`
- `IBM MQ Create Alias`
- `IBM MQ Create Channel`
- `IBM MQ Start a Channel`
- `IBM MQ Start a Channel`
- `IBM MQ Grant Security`
- `IBM MQ Grant PUT,GET`

## IBM MQ Common op fields

All IBM MQ ops have common fields. The key difference
is the template MQSC command that is bundled in each op.

Fields:

- **Queue Manager** (required) - the queue manager resource that contains the
  URL and queue manager name that is being targeted.
- **Error handling** - If `Fail` is set, the op will throw an error when
  something goes wrong.  If `Return error and continue`, if Vault errors, the
  error message will be returned into the rule variable, and no error will be
  thrown.
- **Console text** (required) - the command to be sent to the MQSC console.
  For example: `DEFINE QLOCAL(TEST.QUEUE2) DEFPSIST(YES) DESCR('Queue created
  from Clarive')` to create a queue in the IBM MQ server.

## IBM MQ MQSC command reference

For documentation on what console operations can be sent from Clarive
to your IBM MQ Queue Manager instance, there's more information
here:

https://www.ibm.com/docs/en/ibm-mq/9.2?topic=reference-mqsc-commands

## Console text features

- You can enter many console commands in the `Console Text` input field.  Just
  separate them with a newline.

- Multiple commands are run separetedly with repeated calls to the IBM MQ REST
  interface.

- When multiple commands are present, the values returned to a rule variable
  will be an array.

- Lines can be commented-out by prepending the line with an asterisk `*` on the
  first position.

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.
