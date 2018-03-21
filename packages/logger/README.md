# Logger

An initializer for [Winston](https://github.com/winstonjs/winston). It doesn't add or modify anything and it exists only to encapsulate winston in a named package and provide some sensible defaults to the transports.

## Usage

```
$ npm install --save @sapphirejs/logger
```

```javascript
const { Logger, Transport } = require('@sapphirejs/logger')

const logger = new Logger({}, new Transport.Console()).createLogger()

logger.emerg('Emergency')
logger.alert('Alert')
logger.crit('Critical')
logger.error('Error')
logger.warning('Warning')
logger.notice('Notice')
logger.info('Information')
logger.debug('Debug')
```

The rest of the API is exposed by winston.

# Transports

At the moment there are 3 included transports with plans for more in the future.

## Console

Output messages directly to the console (stdout/stderr).

```javascript
const { Logger, Transport } = require('@sapphirejs/logger')
const logger = new Logger({}, new Transport.Console()).createLogger()
```

## File

Write messages to a single log file.

```javascript
const { Logger, Transport } = require('@sapphirejs/logger')
const logger = new Logger({}, new Transport.File({ filename: 'my.log' })).createLogger()
```

## Daily File Rotate

Write messages to a different file every day. This is a good way of chunking a big log into individual files by date.

```javascript
const { Logger, Transport } = require('@sapphirejs/logger')
const logger = new Logger({}, new Transport.Daily({ filename: './logs/%DATE%.log' })).createLogger()
```
