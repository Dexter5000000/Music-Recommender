$body = '{"spotifyLink":"https://open.spotify.com/test"}'
Write-Host "Testing /api/stats/link endpoint..."
Write-Host "Payload: $body"

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/stats/link" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -TimeoutSec 10
    
    Write-Host "✓ Status: $($response.StatusCode)"
    Write-Host "✓ Response: $($response.Content)"
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)"
    Write-Host "✗ Details: $_"
}
