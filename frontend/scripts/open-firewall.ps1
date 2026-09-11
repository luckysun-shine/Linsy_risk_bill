# Run as Administrator to allow phone LAN access
# Right-click PowerShell -> Run as administrator

$rules = @(
  @{ Name = 'Linsy Bill Dev 5173'; Port = 5173 },
  @{ Name = 'Linsy Bill Preview 4173'; Port = 4173 }
)

foreach ($r in $rules) {
  netsh advfirewall firewall delete rule name="$($r.Name)" 2>$null | Out-Null
  netsh advfirewall firewall add rule name="$($r.Name)" dir=in action=allow protocol=TCP localport=$($r.Port) profile=private,domain | Out-Null
  Write-Host "Allowed TCP port $($r.Port)"
}

Write-Host 'Done. Run: npm run lan:url'
