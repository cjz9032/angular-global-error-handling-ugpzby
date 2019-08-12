Author: Raj - rsahu2@lenovo.com

This folder is required for generating icon files from SVG icons. DO NOT rename any existing file name.



Steps to convert SVG images into icomoon fonts: 

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
