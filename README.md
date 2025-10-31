# tirreno

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/ec30c28f67de476f8b98d2798079bdf0)](https://app.codacy.com/gh/TirrenoTechnologies/tirreno/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Docker Pulls](https://img.shields.io/docker/pulls/tirreno/tirreno?style=flat)](https://hub.docker.com/r/tirreno/tirreno/)

<p align="center">
    <a href="https://www.tirreno.com/" target="_blank">
        <img src="https://www.tirreno.com/firstscreen.jpg" alt="tirreno screenshot" />
    </a>
</p>

The open-source security analytics that your application is missing.

tirreno helps understand, monitor, and protect your applications from cyber threats, account takeovers, and abuse. While classic cybersecurity focuses on infrastructure and network perimeter, most breaches occur through compromised accounts and application logic abuse that bypass firewalls, SIEM, WAFs, and other defenses.

Our platform detects threats where they actually happen, inside your application. It adds a security layer to internal (workforce) or external (customer-facing) applications to identify malicious activity by analyzing user behavior, account activity, field audit trail, and business logic abuse that infrastructure tools cannot detect.

tirreno is a few-dependency, "low-tech" PHP/PostgreSQL software application that can be downloaded and installed on your own web server. After a straightforward five-minute installation process, you can ingest events from your application through API calls and immediately access real-time threat dashboard analytics.

## Live demo

Check out the live demo at [play.tirreno.com](https://play.tirreno.com) (admin/tirreno).

## Requirements

* **PHP**: Version 8.0 to 8.3
* **PostgreSQL**: Version 12 or greater
* **PHP extensions**: `PDO_PGSQL`, `cURL`
* **HTTP web server**: `Apache` with `mod_rewrite` and `mod_headers` enabled
* **Operating system**: A Unix-like system is recommended
* **Minimum hardware requirements**:
  * **PostgreSQL**: 512 MB RAM (4 GB recommended)
  * **Application**: 128 MB RAM (1 GB recommended)
  * **Storage**: Approximately 3 GB PostgreSQL storage per 1 million events

## Docker-based installation (optional)

To run tirreno within docker container you may use image published on [dockerhub](https://hub.docker.com/r/tirreno/tirreno).

```bash
docker pull tirreno/tirreno:latest
```

## Quickstart install

1. [Download](https://www.tirreno.com/download.php) the latest version of tirreno (ZIP file).
2. Extract the tirreno-master.zip file to the location where you want it installed on your web server.
3. Navigate to `http://your-domain.example/install/index.php` in a browser to launch the installation process.
4. After the successful installation, delete the `install/` directory and its contents.
5. Navigate to `http://your-domain.example/signup/` in a browser to create administrator account.
6. For cron jobs setup insert the following schedule (every 10 minutes) expression with `crontab -e` command or by editing `/var/spool/cron/your-web-server` file:

```
*/10 * * * * cd /path/to/tirreno && /usr/bin/php /path/to/tirreno/index.php /cron >> /path/to/tirreno/assets/logs/error.log 2>&1
```

## Using Heroku (optional)

Click [here](https://heroku.com/deploy?template=https://github.com/tirrenotechnologies/tirreno) to launch heroku deployment.

## Documentation

See the [User Guide](https://docs.tirreno.com/) for details on how to use tirreno.

## About

The tirreno project started as a proprietary system in 2021 and was open-sourced (AGPL) in December 2024.

 Behind tirreno is a blend of extraordinary engineers and professionals, with over a decade of experience in cyberdefence. We solve real people's challenges through love in ascétique code and sovereign technologies. tirreno is not VC-motivated. Our inspiration comes from the daily threats posed by organized cybercriminals, driving us to reimagine protection that has never existed before.

## Why the name tirreno?

Tyrrhenian people may have lived in Tuscany and eastern Switzerland as far back as 800 BC. The term "Tyrrhenian" became more commonly associated with the Etruscans, and it is from them that the Tyrrhenian Sea derives its name, which is still in use today.

According to historical sources, Tyrrhenian people were the first to use trumpets for signaling about coming threats, which was later adopted by Greek and Roman military forces.

While working on the logo, we conducted our own historical study and traced mentions of 'tirreno' back to the 15th-century printed edition of the Vulgate (the Latin Bible). We kept it lowercase to stay true to the original — quite literally, by the book. The tirreno wordmark, positioned beyond a horizon line, serves as a metaphor for the constant evolution of the fraud landscape and our commitment to staying ahead of change.

## Links

* [Website](https://www.tirreno.com)
* [Live demo](https://play.tirreno.com)
* [Documentation](https://docs.tirreno.com)
* [Mattermost community](https://chat.tirreno.com)

## Reporting a security issue

If you've found a security-related issue with tirreno, please email security@tirreno.com. Submitting the issue on GitHub exposes the vulnerability to the public, making it easy to exploit. We will publicly disclose the security issue after it has been resolved.

After receiving a report, tirreno will take the following steps:

* Confirm that the report has been received and is being addressed.
* Attempt to reproduce the problem and confirm the vulnerability.
* Release new versions of all the affected packages.
* Announce the problem prominently in the release notes.
* If requested, give credit to the reporter.

## License

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License (AGPL) as published by the Free Software Foundation version 3.

The name "tirreno" is a registered trademark of tirreno technologies sàrl, and tirreno technologies sàrl hereby declines to grant a trademark license to "tirreno" pursuant to the GNU Affero General Public License version 3 Section 7(e), without a separate agreement with tirreno technologies sàrl.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see [GNU Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.txt).

## Authors

tirreno Copyright (C) 2025 tirreno technologies sàrl, Vaud, Switzerland. (License AGPLv3)
