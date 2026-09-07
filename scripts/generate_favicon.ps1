Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\DELL\.gemini\antigravity-ide\brain\595108fe-1bbf-4b69-b195-2b8c85b770fb\.user_uploaded\media_1788821608169.jpg"
Write-Host "Loading source image from: $srcPath"

$srcImage = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source Dimensions: $($srcImage.Width) x $($srcImage.Height)"

# Function to create resized high-quality bitmap
function Get-ResizedBitmap($src, [int]$size) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $size, $size)
    $g.Dispose()
    return $bmp
}

# Function to convert bitmap to PNG bytes in memory
function Get-PngBytes($bmp) {
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bytes = $ms.ToArray()
    $ms.Dispose()
    return $bytes
}

# 1. Generate PNG icons
$sizes = @(16, 32, 48, 64, 128, 180, 192, 256, 512)
$pngFrames = @{}

foreach ($sz in $sizes) {
    $resized = Get-ResizedBitmap $srcImage $sz
    $pngFrames[$sz] = Get-PngBytes $resized
    
    # Save standard Next.js & Web icons
    if ($sz -eq 512) {
        $resized.Save("public\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Save("app\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Save("public\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($sz -eq 192) {
        $resized.Save("public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($sz -eq 180) {
        $resized.Save("public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Save("app\apple-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($sz -eq 32) {
        $resized.Save("public\favicon-32x32.png", [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Save("public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if ($sz -eq 16) {
        $resized.Save("public\favicon-16x16.png", [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $resized.Dispose()
}

# 2. Build multi-resolution ICO file (containing 16, 32, 48, 64, 128, 256 sizes as PNGs)
$icoSizes = @(16, 32, 48, 64, 128, 256)
$icoCount = $icoSizes.Count

$icoStream = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($icoStream)

# ICONDIR Header
$bw.Write([uint16]0)         # Reserved
$bw.Write([uint16]1)         # Type: 1 = ICO
$bw.Write([uint16]$icoCount) # Number of images

# Calculate offsets: Header is 6 bytes + (16 bytes * count)
$offset = 6 + (16 * $icoCount)

# First write Directory entries
foreach ($sz in $icoSizes) {
    $bytes = $pngFrames[$sz]
    $w = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
    $h = if ($sz -ge 256) { [byte]0 } else { [byte]$sz }
    $bw.Write($w)                    # Width
    $bw.Write($h)                    # Height
    $bw.Write([byte]0)               # Colors in palette
    $bw.Write([byte]0)               # Reserved
    $bw.Write([uint16]1)             # Color planes
    $bw.Write([uint16]32)            # Bits per pixel
    $bw.Write([uint32]$bytes.Length) # Image size in bytes
    $bw.Write([uint32]$offset)       # Image data offset
    $offset += $bytes.Length
}

# Then write actual image PNG bytes
foreach ($sz in $icoSizes) {
    [byte[]]$bytes = $pngFrames[$sz]
    $bw.Write($bytes, 0, $bytes.Length)
}

$bw.Flush()
$icoBytes = $icoStream.ToArray()
$bw.Dispose()
$icoStream.Dispose()

# Save multi-resolution .ico to both app/ and public/
[System.IO.File]::WriteAllBytes("app\favicon.ico", $icoBytes)
[System.IO.File]::WriteAllBytes("public\favicon.ico", $icoBytes)

$srcImage.Dispose()
Write-Host "Favicons generated successfully! ICO size: $($icoBytes.Length) bytes."
