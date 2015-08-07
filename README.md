# Adapt JSON Scanner

Scans pre-v2.0.0 Adapt courses for deprecated JSON references, and gives a list of any found.

### Prerequisites

This utility requires npm to install dependencies, and a node environment to run. If you’re already developing Adapt courses either manually, or using a local install of the authoring tool, you will have these already.

Otherwise, go to [the node project’s homepage](https://nodejs.org/) for instructions on installing node (npm comes bundled for free).

### Basic usage

1. To use this utility, first copy the Adapt courses you want to scan into a folder named `courses` in the root of this plugin (you will need to create this when using for the first time).
*Note: that all files in the courses directory are searched, so it is advised to copy only the `course` folder from your Adapt course to reduce the overhead.*

1. Open a terminal window, and navigate to the root directory of this utility.
*For some beginner’s instructions on using the command line, you can find some useful tips here: [Just Enough Command Line for Installing](https://github.com/adaptlearning/adapt_authoring/wiki/Just-Enough-Command-Line-for-Installing).*

1. Run `npm install` to download the required node packages.

1. Start the utility using `node scan`. This starts the node script, and automatically scans all files in the `courses` folder.

1. When the scan has completed, you will get a confirmation in the console, as well as your output of choice (by default, you will find your results in `output/index.html`).

### Advanced usage

#### config.json

There are various settings available in `config/config.json` to allow for more fine-tuned scanning.

Attribute | Type | Description
:-------- | :--- | :----------
**`output.format`** | *String* | Determines how the output is formatted. Accepted values: html, console.
**`output.autoOpen`** | *Boolean* | Whether the output file should open automatically when generated.


#### blacklist.json

This file contains the list of references which have been deprecated in v2.0.0 of Adapt. The references are organised by filename to keep things as neat as possible.

The key for each reference is its dot notation representation as a *String* (e.g. `_spoor._isEnabled`). The following attributes can be set for each reference:

Attribute | Type | Description
:-------- | :--- | :----------
**`negate`** | *Boolean* | This is used to specify where references *should* be included in newer versions of Adapt. By default, it is assumed that anything listed in the blacklist is deprecated, and therefore not allowed. This allows for circumstances where a new attribute has been added, and is required for existing functionality.
**`prerequisite`** | *String* | This is another dot notation string, and can be used to specify that a parent exists. For example, in the case of `_spoor._isEnabled`, you can specify `_spoor` as a prerequisite to ensure that no output is given for courses which don’t have the `_spoor’ object.
**`message`** | *String* | This is presented to the user if any matches are found.
**`link`** | *String* | This should be a URL to a related page (e.g. the Adapt wiki).

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

### Contributing

If you find any bugs, or have new rules for inclusion in the blacklist, please submit them via a pull request to [the GitHub page](https://github.com/taylortom/adapt-json-scanner) for this utility.
