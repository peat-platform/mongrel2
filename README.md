# Mongrel2 module

This module contains the configuration file (cloudlet_platform.conf) for the OPENi Cloudlet Platform Mongrel2 instance. It also contains the directory that servers the Cloudlet Platofrms static content and start/stop scripts.

## Getting Started

```javascript
sh start_mongerl2.sh
```
Creates directories required to run the server (logs/run/tmp), loads the configuration file cloudlet_platform.conf, and starts the server (on port 80). For more information on the configuration setting please read Mongrel2's short documentation (http://mongrel2.org/manual/book-final.html).

```javascript
sh start_mongerl2.sh
```
Stops the mongrel2 instance.


## Conributors
Donal McCarthy (dmccarthy@tssg.org)


## Release History
0.1.0 (23/10/14 dmccarthy@tssg.org) Added static directory and ZeroMQ connector.

## License
Copyright (c) 2013
Licensed under the MIT license.
