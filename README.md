# HAIoT - Hardware Handler

A NodeJS host to manipulate a board running Firmata software.

<!-- The blank line below the opening "div" just makes it work -->
<div align="center">

[![Build Status][travis_badge]][travis_link]
[![codecov][codecov_badge]][codecov_link]
![David DM][david_dependencies]
</div>

## Development

We use [Johnny Five][johnny_five], so a board with Firmata software must be connected to the host.

```bash
$ npm i
$ npm start
```

## Testing

The test environment uses a [mocked Firmata library][mock_firmata] (doesn't need a real board).

```bash
$ npm test
```

[travis_badge]: https://travis-ci.org/ha-iot/hardware-handler.svg?branch=master
[travis_link]: https://travis-ci.org/ha-iot/hardware-handler
[codecov_badge]: https://codecov.io/gh/ha-iot/hardware-handler/branch/master/graph/badge.svg
[codecov_link]: https://codecov.io/gh/ha-iot/hardware-handler
[david_dependencies]: https://david-dm.org/ha-iot/hardware-handler.svg
[mock_firmata]: https://github.com/rwaldron/mock-firmata
[johnny_five]: http://johnny-five.io
