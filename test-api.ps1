Write-Host "`n🧪 Testing Spotify Recommender API" -ForegroundColor Cyan
Write-Host ("=" * 60)

Write-Host "`n1️⃣ Testing Health Check Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing
    Write-Host "✅ Health Check Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2️⃣ Testing Recommendations Endpoint..." -ForegroundColor Yellow
try {
    $body = '{"content":"I love Christian pop music that is uplifting and energetic like Hillsong and Newsboys"}'
    
    $params = @{
        Uri = "http://localhost:3000/api/recommendations/test-001"
        Method = "POST"
        ContentType = "application/json"
        Body = $body
        UseBasicParsing = $true
    }
    
    $response = Invoke-WebRequest @params
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Success: $($data.success)" -ForegroundColor Green
    Write-Host "  Genres: $($data.genres -join ', ')" -ForegroundColor Green
    Write-Host "  Moods: $($data.moods -join ', ')" -ForegroundColor Green
    Write-Host "  Recommendations: $($data.recommendations.Count) found" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + ("=" * 60)
Write-Host "✨ Testing Complete!`n" -ForegroundColor Cyan
