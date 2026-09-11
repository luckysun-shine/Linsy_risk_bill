# Show LAN URL for mobile testing
$ip = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.254.*' -and
    $_.PrefixOrigin -ne 'WellKnown'
  } |
  Sort-Object -Property InterfaceMetric |
  Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
  Write-Host 'No LAN IP found. Check WiFi connection.'
  exit 1
}

Write-Host "LAN IP: $ip"
Write-Host ''
Write-Host "Preview (recommended):"
Write-Host "  http://${ip}:4173/bill"
Write-Host ''
Write-Host "Dev (npm run dev:mobile):"
Write-Host "  http://${ip}:5173/bill"
