fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios generateScreenshots
```
fastlane ios generateScreenshots
```
Generate screenshots for app store
### ios uploadScreenshots
```
fastlane ios uploadScreenshots
```
Upload metadata (screenshots) to app store
### ios uploadBeta
```
fastlane ios uploadBeta
```
Push a new beta build to TestFlight
### ios beta
```
fastlane ios beta
```
Create app ipa and upload to TestFlight

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
