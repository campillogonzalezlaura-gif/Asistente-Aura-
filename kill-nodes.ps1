Get-WmiObject Win32_Process | Where-Object { $_.Name -eq 'node.exe' } | ForEach-Object {
  Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
}
Start-Sleep 1
Write-Output "All node processes killed"
