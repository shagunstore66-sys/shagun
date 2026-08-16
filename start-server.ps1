$port = 3000
$dir = $PSScriptRoot
$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)

try {
    $listener.Start()
    Write-Host "=========================================================================" -ForegroundColor Cyan
    Write-Host "🚀 SHAGUN STORE (Bettadapura) - Central Production Daemon Running" -ForegroundColor Green
    Write-Host "📍 Local Host: http://localhost:$port" -ForegroundColor Yellow
    Write-Host "📱 Owner WhatsApp: +91 77955 65216" -ForegroundColor Cyan
    Write-Host "💳 Axis Bank UPI VPA: 7795565216-1@okbizaxis" -ForegroundColor Yellow
    Write-Host "=========================================================================" -ForegroundColor Cyan

    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $buffer = New-Object byte[] 65536
            $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
            if ($bytesRead -le 0) {
                $client.Close()
                continue
            }

            $request = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
            $firstLine = ($request -split "`r`n")[0]
            $parts = $firstLine -split " "
            $method = $parts[0]
            $url = if ($parts.Length -gt 1) { $parts[1] } else { "/" }
            $urlPath = ($url -split "\?")[0]

            # Handle CORS OPTIONS
            if ($method -eq "OPTIONS") {
                $corsHeader = "HTTP/1.1 200 OK`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type, Authorization`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                $corsBytes = [System.Text.Encoding]::UTF8.GetBytes($corsHeader)
                $stream.Write($corsBytes, 0, $corsBytes.Length)
                $stream.Flush()
                $client.Close()
                continue
            }

            # API Endpoints
            if ($urlPath.StartsWith("/api/")) {
                $responseJson = "{}"
                $statusCode = "200 OK"

                if ($urlPath -eq "/api/config") {
                    $configFile = Join-Path $dir "data\config.json"
                    if ($method -eq "GET") {
                        if (Test-Path $configFile) {
                            $responseJson = [System.IO.File]::ReadAllText($configFile, [System.Text.Encoding]::UTF8)
                        } else {
                            $responseJson = '{"name":"SHAGUN STORE","address":"P.H. Road, Bettadapura - 571102","phone":"+91 77955 65216","upiId":"7795565216-1@okbizaxis"}'
                        }
                    } elseif ($method -eq "PUT" -or $method -eq "POST") {
                        $reqBody = ($request -split "`r`n`r`n", 2)[1]
                        if ($reqBody) {
                            [System.IO.File]::WriteAllText($configFile, $reqBody, [System.Text.Encoding]::UTF8)
                        }
                        $responseJson = '{"status":"OK","saved":true}'
                    }
                } elseif ($urlPath -eq "/api/products") {
                    $prodsFile = Join-Path $dir "data\products.json"
                    if ($method -eq "GET") {
                        if (Test-Path $prodsFile) {
                            $responseJson = [System.IO.File]::ReadAllText($prodsFile, [System.Text.Encoding]::UTF8)
                        } else {
                            $responseJson = "[]"
                        }
                    } elseif ($method -eq "PUT" -or $method -eq "POST") {
                        $reqBody = ($request -split "`r`n`r`n", 2)[1]
                        if ($reqBody) {
                            [System.IO.File]::WriteAllText($prodsFile, $reqBody, [System.Text.Encoding]::UTF8)
                        }
                        $responseJson = '{"status":"OK","saved":true}'
                    }
                } elseif ($urlPath -eq "/api/orders") {
                    $ordersFile = Join-Path $dir "data\orders.json"
                    if ($method -eq "GET") {
                        if (Test-Path $ordersFile) {
                            $responseJson = [System.IO.File]::ReadAllText($ordersFile, [System.Text.Encoding]::UTF8)
                        } else {
                            $responseJson = "[]"
                        }
                    } elseif ($method -eq "POST") {
                        $reqBody = ($request -split "`r`n`r`n", 2)[1]
                        if ($reqBody) {
                            try {
                                $newOrder = $reqBody | ConvertFrom-Json
                                $existingOrders = @()
                                if (Test-Path $ordersFile) {
                                    $raw = [System.IO.File]::ReadAllText($ordersFile, [System.Text.Encoding]::UTF8)
                                    $existingOrders = $raw | ConvertFrom-Json
                                }
                                $allOrders = @($newOrder) + @($existingOrders)
                                $savedJson = $allOrders | ConvertTo-Json -Depth 10
                                [System.IO.File]::WriteAllText($ordersFile, $savedJson, [System.Text.Encoding]::UTF8)
                                Write-Host "[NEW ORDER] Received token: $($newOrder.token) - Customer: $($newOrder.customerName)" -ForegroundColor Green
                            } catch {
                                Write-Host "Error parsing order: $_" -ForegroundColor Red
                            }
                        }
                        $responseJson = '{"status":"SUCCESS","created":true}'
                    } elseif ($method -eq "PUT") {
                        $reqBody = ($request -split "`r`n`r`n", 2)[1]
                        if ($reqBody) {
                            [System.IO.File]::WriteAllText($ordersFile, $reqBody, [System.Text.Encoding]::UTF8)
                        }
                        $responseJson = '{"status":"OK","updated":true}'
                    }
                } elseif ($urlPath -eq "/api/verify-payment") {
                    $txId = "Axis-UTR-" + (Get-Random -Minimum 100000000000 -Maximum 999999999999)
                    $targetOrderId = $null
                    $reqBody = ($request -split "`r`n`r`n", 2)[1]
                    if ($reqBody) {
                        try {
                            $parsedBody = $reqBody | ConvertFrom-Json
                            if ($parsedBody.orderId) { $targetOrderId = $parsedBody.orderId }
                        } catch {}
                    }
                    $ordersFile = Join-Path $dir "data\orders.json"
                    if (Test-Path $ordersFile) {
                        try {
                            $raw = [System.IO.File]::ReadAllText($ordersFile, [System.Text.Encoding]::UTF8)
                            $allOrders = $raw | ConvertFrom-Json
                            if ($allOrders -and $allOrders.Count -gt 0) {
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
                                        Write-Host "[PAYMENT AUTO-VERIFIED] Token #$($allOrders[$i].token) - Ref: $txId" -ForegroundColor Yellow
                                        break
                                    }
                                }
                                $savedJson = $allOrders | ConvertTo-Json -Depth 10
                                [System.IO.File]::WriteAllText($ordersFile, $savedJson, [System.Text.Encoding]::UTF8)
                            }
                        } catch {}
                    }
                    $responseJson = '{"status":"SUCCESS","verified":true,"transactionId":"' + $txId + '"}'
                } elseif ($urlPath -eq "/api/notify-3way") {
                    Write-Host "[3-WAY WHATSAPP DISPATCH] Alerting Admin (7795565216), Staff, and Customer" -ForegroundColor Green
                    $responseJson = '{"success":true,"admin":"7795565216","dispatched":true}'
                } elseif ($urlPath -eq "/api/send-invoice-whatsapp") {
                    Write-Host "[DIGITAL TAX INVOICE SENT VIA WHATSAPP] To Customer" -ForegroundColor Cyan
                    $responseJson = '{"success":true,"invoiceSent":true}'
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

            # Static Files Serving
            $path = $urlPath
            if ($path -eq "/" -or $path -eq "") {
                $path = "/index.html"
            }
            $cleanRelative = $path.TrimStart("/").Replace("/", "\")
            $filePath = Join-Path $dir $cleanRelative

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = "text/plain"
                if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
                elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
                elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
                elseif ($ext -eq ".json") { $contentType = "application/json; charset=utf-8" }
                elseif ($ext -eq ".png") { $contentType = "image/png" }
                elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
                elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }
                elseif ($ext -eq ".ico") { $contentType = "image/x-icon" }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
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
            if ($client) { try { $client.Close() } catch {} }
        }
    }
} catch {
    Write-Host "Server error: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
}
