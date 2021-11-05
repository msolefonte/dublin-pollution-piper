[![NodeJS CI Actions Status](https://img.shields.io/github/workflow/status/msolefonte/dublin-pollution-piper/nodejs-ci)](https://github.com/msolefonte/dublin-pollution-piper/actions)
[![Codecov](https://codecov.io/gh/msolefonte/dublin-pollution-piper/branch/main/graph/badge.svg?token=178AK2GXQL)](https://codecov.io/gh/msolefonte/dublin-pollution-piper)
[![Maintainability](https://api.codeclimate.com/v1/badges/8e48291929dd5190e908/maintainability)](https://codeclimate.com/github/msolefonte/dublin-pollution-piper/maintainability)
[![License](https://img.shields.io/github/license/msolefonte/dublin-pollution-piper)](https://github.com/msolefonte/dublin-pollution-piper/blob/master/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://github.com/msolefonte/dublin-pollution-piper/blob/master/CONTRIBUTING.md)

# Dublin NO<sub>2</sub> Pollution Piper

Open Source application that gathers real-time data about traffic and Nitrogen Dioxide pollution around Dublin, Ireland. 
Results are merged and stored into a MySQL database.

## Configuration

In order to use the application, some previous configuration has to be done. It includes both creation and configuration
of prerequisites and tuning of the main configuration file.

### Prerequisites

This application uses a MySQL database to store the data collected, and it has to be configured for that use. At the 
same time, data is collected from OpenSensorWeb.de and TomTom, so you also have to register in TomTom to get an API key. 

#### MySQL Database

Read more about database configuration in [the dedicated document](docs/database.md).

#### TomTom API

In order to gather real-time traffic from data, an API Key from TomTom has to be used. More information about it can be
found in [the official website](https://developer.tomtom.com/).

Once you already have a valid `API_KEY`, you have to modify the file [src/config/tomtom.json](src/config/tomtom.json)
(before building) or [dist/config/tomtom.json](dist/config/tomtom.json) (if the code has already been built).

### Areas

Areas can be configured manually in the [src/config/areas.json](src/config/areas.json) file. This document includes the
list of areas covered by the application, including both the coordinates used for the traffic service and the sensor
identification. 

As long as sensors are available (which should be at least in Europe thanks to the 
[European Environmental Agency](https://www.eea.europa.eu/themes/air)), this code can be exported to anywhere in the 
world. You can also experiment with other kind of sensors that gather other pollutants in air like O<sub>3/sub>, CO, 
SO<sub>3/sub>, as they use very similar APIs. Feel free to do so!

## Scripts

### Installation

```bash
npm install
```

### Testing

```bash
npm run test:coverage
```

### Build

```bash
npm run build
```

## Execution

```bash
npm run start
```

## Contributing

Feel free to add issues or to create pull requests. Help is always welcome.

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the changelog, see [CHANGELOG.md](CHANGELOG.md). 

## Authors

* **Marc Solé Fonte** - *Initial work* - [msolefonte](https://github.com/msolefonte)

## License

This project is licensed under the Apache License, Version 3.0 - see the [LICENSE](LICENSE) file for details.
