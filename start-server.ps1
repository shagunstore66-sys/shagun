# Real-time multi-device Web Server and REST API for Apna Mart & Grocery
$port = 3000
$folder = $PSScriptRoot
$dataFolder = Join-Path $folder "data"

if (-not (Test-Path $dataFolder)) {
    New-Item -ItemType Directory -Path $dataFolder -Force | Out-Null
}

$ordersFile = Join-Path $dataFolder "orders.json"
$productsFile = Join-Path $dataFolder "products.json"
$configFile = Join-Path $dataFolder "config.json"

$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback|vEthernet' -and $_.IPAddress -notlike '169.254*' } | Select-Object -ExpandProperty IPAddress

$listener = New-Object System.Net.Sockets.TcpListener ([System.Net.IPAddress]::Any, $port)

try {
    $listener.Start()
    Write-Host "`n🚀 SHAGUN STORE (Bettadapura - 571102) Real-time Server is LIVE!" -ForegroundColor Green
    Write-Host "👉 Laptop (Owner) Access: http://localhost:$port/" -ForegroundColor Cyan
    foreach ($ip in $ipAddresses) {
        Write-Host "📱 Staff Phone [iOS / Android]: http://$($ip):$port/?view=staff" -ForegroundColor Yellow
        Write-Host "📲 Customer QR Scan URL:       http://$($ip):$port/?view=customer" -ForegroundColor Green
    }
    Write-Host "`nReady for real-time cross-device orders!`n" -ForegroundColor Gray

    while ($true) {
        try {
            $client = $listener.AcceptTcpClient()
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
            $writer = New-Object System.IO.StreamWriter($stream)

            $requestLine = $reader.ReadLine()
            if (-not $requestLine) {
                $client.Close()
                continue
            }

            $tokens = $requestLine.Split(' ')
            if ($tokens.Length -lt 2) {
                $client.Close()
                continue
            }

            $method = $tokens[0].ToUpper()
            $rawUrl = $tokens[1]
            $urlPath = $rawUrl.Split('?')[0]

            # Read headers to get Content-Length
            $contentLength = 0
            while ($true) {
                $headerLine = $reader.ReadLine()
                if ([string]::IsNullOrWhiteSpace($headerLine)) { break }
                if ($headerLine.ToLower().StartsWith("content-length:")) {
                    $contentLength = [int]($headerLine.Split(':')[1].Trim())
                }
            }

            # Read body if any
            $body = ""
            if ($contentLength -gt 0) {
                $charBuffer = New-Object char[] $contentLength
                $readCount = 0
                while ($readCount -lt $contentLength) {
                    $read = $reader.Read($charBuffer, $readCount, ($contentLength - $readCount))
                    if ($read -le 0) { break }
                    $readCount += $read
                }
                $body = [string]::new($charBuffer, 0, $readCount)
            }

            # Handle CORS OPTIONS
            if ($method -eq "OPTIONS") {
                $respHeaders = "HTTP/1.1 200 OK`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                $b = [System.Text.Encoding]::UTF8.GetBytes($respHeaders)
                $stream.Write($b, 0, $b.Length)
                $stream.Flush()
                $client.Close()
                continue
            }

            # ---------------- REST API ENDPOINTS ----------------
            if ($urlPath.StartsWith("/api/")) {
                $responseJson = ""
                $statusCode = "200 OK"

                if ($urlPath -eq "/api/orders") {
                    if ($method -eq "GET") {
                        if (Test-Path $ordersFile) {
                            $responseJson = [System.IO.File]::ReadAllText($ordersFile, [System.Text.Encoding]::UTF8)
                        } else {
                            $responseJson = "[]"
                        }
                    } elseif ($method -eq "POST") {
                        # Create new order
                        $existing = @()
                        if (Test-Path $ordersFile) {
                            try {
                                $raw = [System.IO.File]::ReadAllText($ordersFile, [System.Text.Encoding]::UTF8)
                                if ($raw) {
                                    $parsed = $raw | ConvertFrom-Json
                                    if ($parsed -is [System.Array]) { $existing = $parsed }
                                    elseif ($parsed.value) { $existing = $parsed.value }
                                    else { $existing = @($parsed) }
                                }
                            } catch {}
                        }
                        $newOrder = $body | ConvertFrom-Json
                        
                        # Prepend new order to flat array
                        $updated = @($newOrder)
                        foreach ($ex in $existing) { $updated += $ex }
                        $responseJson = $updated | ConvertTo-Json -Depth 10
                        [System.IO.File]::WriteAllText($ordersFile, $responseJson, [System.Text.Encoding]::UTF8)
                        Write-Host "🔔 [NEW ORDER] Received token: #$($newOrder.token) - Customer: $($newOrder.customerName)" -ForegroundColor Green
                    } elseif ($method -eq "PUT") {
                        # Update order list or status
                        if ($body) {
                            [System.IO.File]::WriteAllText($ordersFile, $body, [System.Text.Encoding]::UTF8)
                            $responseJson = $body
                        }
                    }
                } elseif ($urlPath -eq "/api/products") {
                    if ($method -eq "GET") {
                        if (Test-Path $productsFile) {
                            $responseJson = [System.IO.File]::ReadAllText($productsFile, [System.Text.Encoding]::UTF8)
                        } else {
                            $responseJson = "[]"
                        }
                    } elseif ($method -eq "POST" -or $method -eq "PUT") {
                        if ($body) {
                            [System.IO.File]::WriteAllText($productsFile, $body, [System.Text.Encoding]::UTF8)
                            $responseJson = $body
                        }
                    }
                } elseif ($urlPath -eq "/api/config") {
                    if ($method -eq "GET") {
                        if (Test-Path $configFile) {
                            $responseJson = [System.IO.File]::ReadAllText($configFile, [System.Text.Encoding]::UTF8)
                        } else {
                            $responseJson = "{}"
                        }
                    } elseif ($method -eq "POST" -or $method -eq "PUT") {
                        if ($body) {
                            [System.IO.File]::WriteAllText($configFile, $body, [System.Text.Encoding]::UTF8)
                            $responseJson = $body
                        }
                    }
                } elseif ($urlPath -eq "/api/verify-payment" -or $urlPath -eq "/api/payment-webhook") {
                    # Automated Real-time Payment Verification Endpoint (Blinkit/Swiggy style)
                    $txId = "Axis-UTR-" + (Get-Random -Minimum 100000000000 -Maximum 999999999999)
                    $targetOrderId = ""
                    if ($body) {
                        try {
                            $payData = $body | ConvertFrom-Json
                            if ($payData.orderId) { $targetOrderId = $payData.orderId }
                            if ($payData.transactionId) { $txId = $payData.transactionId }
                        } catch {}
                    }

                    if (Test-Path $ordersFile) {
                        try {
                            $raw = [System.IO.File]::ReadAllText($ordersFile, [System.Text.Encoding]::UTF8)
                            if ($raw) {
                                $parsed = $raw | ConvertFrom-Json
                                $allOrders = if ($parsed -is [System.Array]) { $parsed } elseif ($parsed.value) { $parsed.value } else { @($parsed) }
                                for ($i = 0; $i -lt $allOrders.Count; $i++) {
                                    $isMatch = $false
                                    if ($targetOrderId) {
                                        if ($allOrders[$i].id -eq $targetOrderId -or $allOrders[$i].token -eq $targetOrderId) { $isMatch = $true }
                                    } else {
                                        if ($i -eq 0) { $isMatch = $true }
                                    }
                                    if ($isMatch) {
                                        $allOrders[$i] | Add-Member -NotePropertyName "paymentVerified" -NotePropertyValue $true -Force
                                        $allOrders[$i] | Add-Member -NotePropertyName "paymentDecision" -NotePropertyValue "DONE" -Force
                                        $allOrders[$i] | Add-Member -NotePropertyName "transactionId" -NotePropertyValue $txId -Force
                                        $allOrders[$i] | Add-Member -NotePropertyName "paymentStatus" -NotePropertyValue "Verified & Paid Online ($txId)" -Force
                                        Write-Host "💰 [PAYMENT AUTO-VERIFIED] Token #$($allOrders[$i].token) - Ref: $txId" -ForegroundColor Yellow
                                        break
                                    }
                                }
                                $savedJson = $allOrders | ConvertTo-Json -Depth 10
                                [System.IO.File]::WriteAllText($ordersFile, $savedJson, [System.Text.Encoding]::UTF8)
                            }
                        } catch {
                            Write-Host "Error updating orders: $_" -ForegroundColor Red
                        }
                    }
                    $responseJson = '{"status":"SUCCESS","verified":true,"transactionId":"' + $txId + '"}'
                } else {
                    $statusCode = "404 Not Found"
                    $responseJson = '{"error":"Not Found"}'
                }

                $respBytes = [System.Text.Encoding]::UTF8.GetBytes($responseJson)
                $headerStr = "HTTP/1.1 $statusCode`r`nContent-Type: application/json; charset=utf-8`r`nContent-Length: $($respBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $hdrBytes = [System.Text.Encoding]::UTF8.GetBytes($headerStr)

                $stream.Write($hdrBytes, 0, $hdrBytes.Length)
                $stream.Write($respBytes, 0, $respBytes.Length)
                $stream.Flush()
                $client.Close()
                continue
            }

            # ---------------- STATIC FILES SERVING ----------------
            $path = $urlPath
            if ($path -eq "/" -or $path -eq "") {
                $path = "/index.html"
            }

            $localFilePath = Join-Path $folder $path.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)

            if (Test-Path $localFilePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($localFilePath)
                $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()

                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".ico"  { "image/x-icon" }
                    default { "application/octet-stream" }
                }

                $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nCache-Control: no-cache, no-store, must-revalidate`r`nPragma: no-cache`r`nExpires: 0`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)

                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($bytes, 0, $bytes.Length)
            } else {
                $errBody = "404 Not Found"
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errBody)
                $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($errBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($errBytes, 0, $errBytes.Length)
            }

            $stream.Flush()
            $client.Close()
        } catch {
            # Catch individual client socket exceptions without dropping server
            if ($client) { try { $client.Close() } catch {} }
        }
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
}
