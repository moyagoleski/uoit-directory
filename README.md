# Ontario Tech Directory

This repository contains the application source code for the University's faculty and staff directory search; built with AngularJS and Foundation 6 using Gulp.

## The simple 🐻 necessities

### Setup

1. Clone this repo and make it your working directory:
	```sh
	git clone https://github.com/uoitwebteam/uoit-directory.git
	cd uoit-directory
	```
2. Run a package installer from the root directory. You have two options to choose from:
	```sh
	npm install # slow, womp womp
	# or...
	yarn # FAST! / hipster npm install
	```

### Scripts

#### Development
-   ```sh
    npm run start
    # or...
    yarn start
    ```
    Run build steps and sets up file watcher.

#### Production
-   ```sh
    npm run build
    # or...
    yarn build
    ```
    Run production build steps and minify.

### Example

Boot up a local webserver (such as MAMP) and visit the [/example](/example) directory.