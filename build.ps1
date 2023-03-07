Remove-item -Path "./deblinder.xpi" -Force

Compress-Archive -Path "./deblinder.js", "./manifest.json", "./icons/*" -DestinationPath "./deblinder.zip"

Rename-Item -Path ".\deblinder.zip" -NewName ".\deblinder.xpi"