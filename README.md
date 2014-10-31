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

Installation
------------

```sh
git clone git@github.com:GhostWording/gw-mobile-hello-mum.git
cd gw-mobile-hello-mum
npm install
bower install
```

Building
--------

**browser**
```gulp build``` or ```gulp watch```

**android**
```gulp build:android```

**ios**
```gulp build:ios``` (osx only)

postfix --debug for debug build.

Running
-------

**browser**
```gulp serve```

**android**
```gulp run:android```

**ios**
```gulp run:ios```

postfix --debug for debug build.
