Author: Raj - rsahu2@lenovo.com

This folder is required for generating icon files from SVG icons. DO NOT rename any existing file name.

# Important Note

> Folder location : src\hw-settings-icomoon\app-svg-icons\

If you are adding any new icon to icommon font file, don't forget to copy SVG file in above folder location otherwise when we will be new font file, it will be overwritten.

# Note: No need to copy woff file in assets folder instead copy in `src\hw-settings-icomoon\app-svg-icons\fonts`

# Steps to convert SVG images into icomoon fonts: 

1. Check if other SVG file with same name is in this folder.
	If so, rename the file to some unique name.
2. Paste that file in this folder.
3. Visit https://icomoon.io/app link.
4. There is section *IcoMoon - Free*. Remove that set by choosing remove set from options.
5. Click on Import icons.
6. Select all files except _readme.md and click on Open in File Dialogue.
7. Click on select all option.
8. Goto Generate Font from bottom of the page .
9. Set Preferences:

10. Click on Download from same pace as above.
11. icomoon.zip will be downloaded.
12. Extract that file & Copy *icomoon.woff* file from icomoon/fonts/ folder to vtr-ui/src/assets/fonts folder.
13. Copy All the content from icomoon/variables.scss to icomoon-variables.scss.
14. Copy all content from line no 29 to eof of icomoon/style.scss to icomoon-style.scss.


# Hot to convert WOFF font file to base64 string. I will try to automate this process in future.

visit https://www.fontsquirrel.com/tools/webfont-generator and upload WOFF font file, select all file from upload dialog to select WOFF file.

> Font Formats: WOFF

> Truetype Hinting:  Keep Existing

> Rendering: Fix GASP Table

> Vertical Metrics: Auto-Adjust Vertical Metrics

> Fix Missing Glyphs: Select both options

> X-height Matching: None

> Protection: None

> Subsetting: Basic Subsetting

> OpenType Features: None

> OpenType Flattening: None

> CSS:  Base64 Encode

> Advanced Options: None

Once all of the above setting are set, check Agreement and click on DOWNLOAD YOUR KIT button.

From downloaded zip file open **stylesheet.css** and copy ` src:url` part and replace it in `src\hw-settings-icomoon\icomoon-base64.scss` file `src:url` part.
