# Delete previous builds
Write-Host 'Deleting old build...';
Remove-item -Path "./Deblinder.xpi" -Force -ErrorAction SilentlyContinue

# Compile Firefox version
Write-Host 'Packing Firefox build (XPI)...';
Compress-Archive -Path "./src/deblinder.js", "./src/manifest.json", "./src/icons/*" -DestinationPath "./Deblinder.zip"
Rename-Item -Path ".\Deblinder.zip" -NewName ".\Deblinder.xpi"

# # Compile Chrome version (requires chrome in PATH)
# Write-Host 'Packing Chrome build (CRX)...';
# $path = '"C:\Program Files\Google\Chrome\Application\chrome.exe"'
# $params = "`--pack-extension=$pwd/src `--pack-extension-key=$pwd/Deblinder.pem"
# $cmd = {cmd /c "$path $params"}
# Invoke-Command $cmd
# Rename-Item -Path ".\src.crx" -NewName ".\Deblinder.crx"

Write-Host 'Done building XPI file!';