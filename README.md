"Hello Mum" Mobile Application
==============================

Application Structure
---------------------

See [Mobile Platform Application Structure](https://github.com/GhostWording/gw-mobile-platform#application-structure)

Prerequisites
-------------

See [Mobile Platform Prerequisites](https://github.com/GhostWording/gw-mobile-platform#prerequisites)

Create Application
------------------

```sh
ionic start gw-mobile-hello-mum blank -i com.ghostwording.hellomum
```
> the first parameter should match the application repo name  
> the last parameter is the bundle identifier of the application on the android/ios store(s)

Install Mobile Platform
-----------------------

```sh
cd gw-mobile-hello-mum 
git init
git remote add origin git@github.com:GhostWording/gw-mobile-platform.git
git fetch origin
git reset --hard origin/master
```

Install Application Code
------------------------

```sh
rm -r -f .git
git init
git remote add origin git@github.com:GhostWording/gw-mobile-hello-mum.git
git fetch origin
git reset --hard origin/master
```

Install 3rd Party Libraries
---------------------------

```sh
npm install
bower install
```

Add Target Platforms
--------------------

```sh
ionic platform add ios
ionic platform add android
```

Build / Run
-----------

See [Mobile Platform Build / Run](https://github.com/GhostWording/gw-mobile-platform#build--run)

Publish
-------

See [Mobile Platform Publish](https://github.com/GhostWording/gw-mobile-platform#publish)
