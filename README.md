# volto-elastic-csv-widget

[![Releases](https://img.shields.io/github/v/release/eea/volto-elastic-csv-widget)](https://github.com/eea/volto-elastic-csv-widget/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-elastic-csv-widget%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-elastic-csv-widget/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-elastic-csv-widget%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-elastic-csv-widget/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-elastic-csv-widget&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-elastic-csv-widget&branch=develop)


[Volto](https://github.com/plone/volto) add-on

## Features

Demo GIF

## Getting started

### Try volto-elastic-csv-widget with Docker

      git clone https://github.com/eea/volto-elastic-csv-widget.git
      cd volto-elastic-csv-widget
      make
      make start

Go to http://localhost:3000

### Add volto-elastic-csv-widget to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-elastic-csv-widget"
   ],

   "dependencies": {
       "@eeacms/volto-elastic-csv-widget": "*"
   }
   ```

* If not, create one:

   ```
   npm install -g yo @plone/generator-volto
   yo @plone/volto my-volto-project --canary --addon @eeacms/volto-elastic-csv-widget
   cd my-volto-project
   ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-elastic-csv-widget/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-elastic-csv-widget/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-elastic-csv-widget/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
