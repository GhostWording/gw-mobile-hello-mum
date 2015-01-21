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

#### android sdk (standalone)
[developer.android.com](https://developer.android.com/sdk/index.html?hl=i#download)

#### xcode (building for ios - osx only)
[developer.apple.com](https://developer.apple.com/xcode/downloads/)

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
and / or

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

```sh
gulp build:android
cordova build android --release
```
<enter keystore password>

After which a signed apk can be found in platforms/android/ant-build/<app>-release.apk
