param([string]$BaseUrl = 'http://127.0.0.1:9292')
$ErrorActionPreference = 'Stop'
$catalog = Invoke-RestMethod "$BaseUrl/products/sea-moss-gel-banana.js" -TimeoutSec 30
$page = (Invoke-WebRequest "$BaseUrl/products/sea-moss-gel-banana?variant=$($catalog.variants[0].id)" -UseBasicParsing -TimeoutSec 30).Content
if ($page.Contains('Liquid error') -or $page.Contains('Could not find asset snippets')) { throw 'Liquid rendering error in product page' }
$panels = [regex]::Matches($page, '(?s)<div data-flavor-label="(?<flavor>[^"]+)".*?(?=<div data-flavor-label=|<!-- label-panels-end -->)')
$expected = @($catalog.variants | ForEach-Object { $_.option1 } | Select-Object -Unique)
if ($panels.Count -ne $expected.Count) { throw "Expected $($expected.Count) flavor panels; found $($panels.Count)" }
$structured = 0
$missing = 0
$tables = 0
$nutritionGaps = 0
foreach ($panel in $panels) {
  $flavor = [System.Net.WebUtility]::HtmlDecode($panel.Groups['flavor'].Value)
  if ($flavor -notin $expected) { throw "Unexpected panel: $flavor" }
  if ($panel.Value.Contains('hx-label-nutrition')) {
    $structured++
    if (-not $panel.Value.Contains('View original printed label')) { throw "Original label unavailable for $flavor" }
    if ($panel.Value -match '(?s)<table.*?</table>') { $tables++ }
    elseif ($panel.Value -match '(?i)(nutrition.*unavailable|nutrition.*not visible|no nutrition facts)') { $nutritionGaps++ }
    else { throw "Neither nutrition table nor explicit source-gap notice for $flavor" }
    if ($panel.Value -match '<details class="hx-label-originals" open') { throw "Original images should be collapsed for $flavor" }
  } elseif ($panel.Value.Contains('Label details are not available yet')) {
    $missing++
    if ($panel.Value -match '<img') { throw "Unverified source image exposed for $flavor" }
  } else { throw "Neither structured details nor explicit missing-source state for $flavor" }
}
if ($structured -ne 17) { throw "Expected 17 source-checked structured flavors; found $structured" }
if ($tables -ne 2 -or $nutritionGaps -ne 15) { throw "Expected 2 sourced nutrition tables and 15 missing-nutrition notices; found $tables and $nutritionGaps" }
if ($page.Contains('Printed ingredients and label information')) { throw 'Old image-only drawer heading remains' }
Write-Output "PASS: $structured structured labels ($tables nutrition tables, $nutritionGaps nutrition-source gaps); $missing missing-source panels; $($panels.Count) total flavor panels; no Liquid errors."
