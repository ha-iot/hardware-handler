<!-- The blank line below the opening "div" just makes it work -->
<div align="center">

# HAIoT - Hardware Handler

A NodeJS host to manipulate a board running Firmata software.

[![Build Status][travis_badge]][travis_link]
[![codecov][codecov_badge]][codecov_link]
![David DM][david_dependencies]
</div>

## HAIoT System

This is part of the **HAIoT System** for house automation.

- [Socket Server][socket_server_link]
- [Frontend App][frontend_app_link]

## Installing dependencies

```bash
git clone https://github.com/ha-iot/hardware-handler/
cd hardware-handler 
npm i
```

## Development

We use [Johnny Five][johnny_five_link], so a board with Firmata software is required to be connected.
You can manually set the port that a board is connected [at environment level](.env.example).

**Note**: You must set an environment variable called `SOCKET_HOST` for it to run.

```bash
npm start  # Have a board attached to the host 
npm start -- --mock-board # Run this project without a board (for simulation purposes)
npm run start-supervisor  # Rerun if process stops
```

## Testing

The test environment uses a [mocked Firmata library][mock_firmata] (doesn't need a real board).

```bash
$ npm test
```

[socket_server_link]: https://github.com/ha-iot/ha-socket-server/
[frontend_app_link]: https://github.com/ha-iot/ha-frontend/
[travis_badge]: https://travis-ci.org/ha-iot/hardware-handler.svg?branch=master
[travis_link]: https://travis-ci.org/ha-iot/hardware-handler
[codecov_badge]: https://codecov.io/gh/ha-iot/hardware-handler/branch/master/graph/badge.svg
[codecov_link]: https://codecov.io/gh/ha-iot/hardware-handler
[david_dependencies]: https://david-dm.org/ha-iot/hardware-handler.svg
[mock_firmata]: https://github.com/rwaldron/mock-firmata
[johnny_five_link]: http://johnny-five.io
