# GW2Clipboard

**A Windows application that allows you to store text to be pasted into Guild Wars 2 via the clipboard.** 

The application can exist in either an Open Drawer state (where the UI is fully visible) or a Closed Drawer state where only the Icon bar is visible - both states store their own size and positional information.

This can be used to store Build templates and general text you may wish to use during game-play, including content-specific strategies you regularly paste into the game.
 
**Please note:** Integration with Guild Wars 2 is limited to the MumbleLink: https://wiki.guildwars2.com/wiki/API:MumbleLink
****

## Releases
**The application is currently in beta, please help find any issues!**

For current releases please follow the following link:
https://github.com/maklorgw2/gw2clipboard/releases
****
## Overview
The application uses sets of information (called categories) that are filtered by the MumbleLink information.

Each category can have a set of tags. Current tags are:
* Profession (ie Necromancer)
* Map
* Game-mode
* Commander Tag active

Inside each category is a set of groups, groups are where the text to be copied to the clipboard is stored.

A **Build category** can have multiple groups each with a single text-item and name. 

A **Text category** can have multiple groups and each group can have multiple text-items.

Text is automatically copied to the clipboard when you click on it, or you navigate to item via the hotkeys.

### Hotkeys
System-wide Hotkeys (can be used when GW2 has focus)
````
Alt-Up, Alt-Down, Alt-Left and Alt-Right: Navigate through and inside the categories
Alt-B: Toggle drawer (open and closed) and go to the Build categories
Alt-T: Toggle drawer (open and closed) and go to the Text categories
Alt-BackSpace: Close drawer 
````

Local keys (when application has focus)
````
Up, Down, Left and Right: Navigate through and inside the categories
Escape: Close drawer
````

### Game-modes
Each map has been allocated one of the following game-modes:
* WvW
* PvP
* PvE
* Dungeons
* Fractals
* Raids

Any unknown new maps are allocated as PvE.

### Configuration
There are three main configuration files:
* settings.json - General settings
* categories.json - Category settings you have set-up
* maps.json - Map information (id, name, game-mode etc)

## Requirements for running application
* Windows 10
* .NET Framework 4.61

****
## Building the code
### Requirements for building application
* Visual Studio 2019
* Optional: Bundling and Minifier plug-in 
* Optional: Visual Studio Code

### The Host application
The Host application is a Windows Forms application written in C#. 
The UI uses a machine-local webpage via a WebBrowser control.

### The Client application
The Client application (the User Interface) is written in Typescript and React, and can be built as dev or release.

First you will need to install the dependencies:
 ````
 cd /path-to-project/ClientApp/ts
 npm install
 ````


 To build the dev bundle (and watches for changes) 
 ````
 npm run build
 ````
 To build the minified release bundle
 ````
 npm run release
 ````



