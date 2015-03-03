GhostWording "Hello Mum" Mobile Application
===========================================

Prerequisites
-------------

#### node.js
[nodejs.org](http://nodejs.org)

#### bower
```npm install -g bower```

#### gulp
```npm install -g gulp```

#### cordova
```npm install -g cordova```

#### ionic
```npm install -g ionic```

#### android SDK (standalone)
[developer.android.com](https://developer.android.com/sdk/index.html?hl=i#download)

#### xCode (building for ios - osx only)
[developer.apple.com](https://developer.apple.com/xcode/downloads/)

Windows Prerequisites
---------------------

Follow the instructions found [here](http://ionicframework.com/docs/guide/installation.html)
(click the red "Windows note on Java, Ant and Android" button)

**summary**

* Set the ANDROID_HOME environment variable to reference the downloaded SDK folder
* Add the tools and platform-tools folders in the android SDK to the system PATH environment variable
* Install apache Ant
* Install Java JDK

Install
-------

```sh
git clone git@github.com:GhostWording/gw-mobile-hello-mum.git
cd gw-mobile-hello-mum
npm install
bower install
```

Adding platforms
----------------

```sh
ionic platform add ios
```
**and / or**

```sh
ionic platform add android
```

Run in browser
--------------

```gulp build``` or ```gulp watch``` then ```gulp serve```

Run on emulator
---------------

**android**
```gulp emulate:android```

**ios**
```gulp emulate:ios``` (osx only)

postfix --debug for debug build.

Run on device
-------------

**android**
```gulp run:android```

**ios**
```gulp run:ios``` (osx only)

postfix --debug for debug build.

Linking with common
-------------------

Simultaneous development of gw-mobile-hello-mum and gw-common

```sh
cd ..
git clone git@github.com:GhostWording/gw-common.git
cd gw-common
bower link
cd ../gw-mobile-hello-mum
bower link gw-common
```

After which gw-common code can be edited/committed from both:

gw-common 

**and**

gw-mobile-hello-mum/src/lib/gw-common

Linking with mobile common
--------------------------

Simultaneous development of gw-mobile-hello-mum and gw-mobile-common

```sh
cd ..
git clone git@github.com:GhostWording/gw-mobile-common.git
cd gw-mobile-common
bower link
cd ../gw-mobile-hello-mum
bower link gw-mobile-common
```

After which gw-mobile-common code can be edited/committed from both:

gw-mobile-common 

**and**

gw-mobile-hello-mum/src/lib/gw-mobile-common

Publishing
----------

**android**

* Make sure to bump the version in config.xml

```sh
gulp build:android
cordova build android --release
```
<enter keystore password>

After which a signed apk can be found in platforms/android/ant-build/<app>-release.apk

**ios**

* Make sure to bump the version in config.xml
* Make sure the ghostwording distribution certificate is on your keychain

```sh
git clone git@github.com:GhostWording/gw-mobile-hello-mum.git
cd gw-mobile-hello-mum
npm install
bower install
ionic platform add ios
gulp build:ios
cd platforms/ios
open HelloMum.xcodeproj
```

And in Xcode..

* Unplug any ios device
* Make sure "HelloMum" > "iOS device" is selected on the left of the top grey bar
* Product / Archive (from menu)
* Click estimate size and see if it seems about right to make sure its built properly.
* Hit Submit
