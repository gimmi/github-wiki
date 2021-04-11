param (
    [String]
    [Parameter(Mandatory=$true)]
    [ValidateSet('server', 'client')]
    $Cmd
)

if ($Cmd -eq 'server') {
    npx http-server "$PSScriptRoot\server\src\static"
}

if ($Cmd -eq 'client') {
    Start-Process -FilePath "http://localhost:8080/"

    cd "$PSScriptRoot\client"
    if (-not (Test-Path node_modules)) {
        npm install
    }
    npm run watch
}
