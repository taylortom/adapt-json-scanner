# Adapt JSON Scanner
Scans pre-v2.0.0 Adapt courses for deprecated JSON references, and gives a list of any found.

## Prerequisites
This utility requires npm to install dependencies, and a node environment to run. If you're already developing Adapt courses either manually, or using a local install of the authoring tool, you will have these already.

Otherwise, go to [the node project's homepage](https://nodejs.org/) for instructions on installing node (npm comes bundled for free).

## Basic usage
- To use this utility, first copy the Adapt courses you want to scan into a folder named `courses` in the root of this plugin (you will need to create this when using for the first time).

  _Note: that all files in the courses directory are searched, so it is advised to copy only the `course` folder from your Adapt course to reduce the overhead._

- Open a terminal window, and navigate to the root directory of this utility.

  _For some beginner's instructions on using the command line, you can find some useful tips here: [Just Enough Command Line for Installing](https://github.com/adaptlearning/adapt_authoring/wiki/Just-Enough-Command-Line-for-Installing)._

- Run `npm install` to download the required node packages.
- Start the utility using `node scan`. This starts the node script, and automatically scans all files in the `courses` folder.
- When the scan has completed, you will get a confirmation in the console, as well as your output of choice (by default, you will find your results should open in a new browser window).

## Advanced usage
### config.json
There are various settings available in `config/config.json` to allow for more fine-tuned scanning.

Attribute         | Type      | Description
:---------------- | :-------- | :----------
`output.format`   | *String*  | Determines how the output is formatted.
`output.autoOpen` | *Boolean* | Whether the output file should open automatically when generated.

#### Output plugins
The following plugins are available. To use, specify their name in the `output.format` field in `config.json`.

Name        | Description
:---------- | :----------
`html`      | Creates a formatted HTML page in `/output/html/results.html`.
`console`   | Logs the scan results JSON object to the console window.

### blacklist.json
This file contains the list of references which have been deprecated in v2.0.0 of Adapt. The references are organised by filename to keep things as neat as possible.

The key for each reference is its dot notation representation as a _String_ (e.g. `_spoor._isEnabled`). The following attributes can be set for each reference:

Attribute          | Type      | Description
:----------------- | :-------- | :----------
**`negate`**       | *Boolean* | This is used to specify where references *should* be included in newer versions of Adapt. By default, it is assumed that anything listed in the blacklist is deprecated, and therefore not allowed. This allows for circumstances where a new attribute has been added, and is required for existing functionality.
**`prerequisite`** | *String*  | This is another dot notation string, and can be used to specify that a parent exists. For example, in the case of `_spoor._isEnabled`, you can specify `_spoor` as a prerequisite to ensure that no output is given for courses which don’t have the `_spoor’ object.
**`message`**      | *String*  | This is presented to the user if any matches are found.
**`link`**         | *String*  | This should be a URL to a related page (e.g. the Adapt wiki).

An example reference object could be:

```
“property.otherProperty.thirdProperty”: {
   “negate”: true,
   “prerequisite”: “property.otherProperty”,
   “message”: “Change this.”,
   “link”: “https://github.com/taylortom/”,
}
```

This is then filed under the relevant filename.

## Contributing
If you find any bugs, or have new rules for inclusion in the blacklist, please submit them via a pull request to [the GitHub page](https://github.com/taylortom/adapt-json-scanner) for this utility.

### Output plugins
You can also submit alternative output plugins via GitHub.

1. Create a subfolder in `output/` with the name of your plugin.
<br>**Tip**: whatever you name this folder will be what is required in the `output.format` field in `config.json`, so single words are preferable.
1. Create a `main.js`. This will be the main entry point for your plugin.
1. Write teh codez. Where possible, please try and integrate with the existing output options in `config.json`, and feel free to add your own plugin-specific ones. On this note: remember that users may not be using your plugin, so please put these somewhere that won't be confused for a global config option.
<br>**Tip**: although there is no need to manually require your output plugin in any of the existing files, you will need to add any node dependencies to `package.json`.
1. Update this README with instructions.
