param([string]$PythonPath = '')

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if (-not $PythonPath) {
    $bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
    if (Test-Path -LiteralPath $bundledPython) { $PythonPath = $bundledPython }
    else { $PythonPath = (Get-Command python -ErrorAction Stop).Source }
}
& $PythonPath -c 'import jsonschema'
if ($LASTEXITCODE -ne 0) { throw 'The chosen Python needs jsonschema. Install apps/healistix-builder/requirements.txt in that Python environment.' }

$backendFile = Join-Path $projectRoot 'apps\healistix-builder\server.py'
$previewFile = Join-Path $projectRoot 'prototypes\hx-builder\serve.py'
foreach ($requiredFile in @($backendFile, $previewFile)) {
    if (-not (Test-Path -LiteralPath $requiredFile)) { throw "Missing preview file: $requiredFile" }
}

$logDirectory = Join-Path $projectRoot 'output\custom-builder\logs'
New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null
function Test-BuilderBackend {
    try {
        $health = Invoke-RestMethod 'http://127.0.0.1:8787/health' -TimeoutSec 2
        return ($health.status -eq 'ok' -and $health.preview_only -eq $true -and $health.purchase_enabled -eq $false)
    } catch { return $false }
}
function Test-BuilderPage {
    try {
        $page = Invoke-WebRequest 'http://127.0.0.1:8788/' -TimeoutSec 2 -UseBasicParsing
        return ($page.StatusCode -eq 200 -and $page.Content -match 'hx-builder')
    } catch { return $false }
}

if (-not (Test-BuilderBackend)) {
    Start-Process -FilePath $PythonPath -ArgumentList @('-u', ('"' + $backendFile + '"')) -WorkingDirectory (Split-Path -Parent $backendFile) -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'backend.out.log') -RedirectStandardError (Join-Path $logDirectory 'backend.err.log') | Out-Null
}
if (-not (Test-BuilderPage)) {
    Start-Process -FilePath $PythonPath -ArgumentList @('-u', ('"' + $previewFile + '"')) -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $logDirectory 'preview.out.log') -RedirectStandardError (Join-Path $logDirectory 'preview.err.log') | Out-Null
}

for ($attempt = 0; $attempt -lt 10; $attempt++) {
    if ((Test-BuilderBackend) -and (Test-BuilderPage)) {
        Write-Output 'Builder preview ready: http://127.0.0.1:8788/'
        Write-Output 'Local to this computer. Purchasing disabled. Existing preview processes are reused.'
        exit 0
    }
    Start-Sleep -Milliseconds 500
}
throw "Preview did not become ready. Check $logDirectory and whether ports 8787/8788 are occupied. No existing process was stopped."
