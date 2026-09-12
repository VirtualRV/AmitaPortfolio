Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Vikas\.gemini\antigravity-ide\brain\45765d1b-56de-4a4e-9b7c-704f0e88a9e9\amita_pwa_icon_master_1789241329252.jpg"
$outputDir = "d:\AmitaPortFolio\assets\icons"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

$srcImage = [System.Drawing.Image]::FromFile($sourcePath)

function Resize-And-Save {
    param(
        [System.Drawing.Image]$img,
        [int]$width,
        [int]$height,
        [string]$destPath,
        [float]$scale = 1.0
    )
    $destBitmap = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($scale -lt 1.0) {
        $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#0c0f0e"))
        $graphics.FillRectangle($bgBrush, 0, 0, $width, $height)
        $bgBrush.Dispose()

        $drawW = [int]($width * $scale)
        $drawH = [int]($height * $scale)
        $offsetX = [int](($width - $drawW) / 2)
        $offsetY = [int](($height - $drawH) / 2)
        $graphics.DrawImage($img, $offsetX, $offsetY, $drawW, $drawH)
    } else {
        $graphics.DrawImage($img, 0, 0, $width, $height)
    }

    $graphics.Dispose()
    $destBitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBitmap.Dispose()
    Write-Output "Saved: $destPath ($width x $height)"
}

# Generate PWA Icons
Resize-And-Save -img $srcImage -width 512 -height 512 -destPath (Join-Path $outputDir "icon-512.png")
Resize-And-Save -img $srcImage -width 192 -height 192 -destPath (Join-Path $outputDir "icon-192.png")
Resize-And-Save -img $srcImage -width 180 -height 180 -destPath (Join-Path $outputDir "apple-touch-icon.png")
Resize-And-Save -img $srcImage -width 32 -height 32 -destPath (Join-Path $outputDir "favicon-32x32.png")
Resize-And-Save -img $srcImage -width 16 -height 16 -destPath (Join-Path $outputDir "favicon-16x16.png")

# Maskable icon with 82% safe-zone scale
Resize-And-Save -img $srcImage -width 512 -height 512 -destPath (Join-Path $outputDir "icon-maskable.png") -scale 0.82

# Also generate root favicon.ico using 32x32 PNG format
Copy-Item (Join-Path $outputDir "favicon-32x32.png") -Destination "d:\AmitaPortFolio\favicon.ico" -Force
Copy-Item (Join-Path $outputDir "favicon-32x32.png") -Destination (Join-Path $outputDir "favicon.ico") -Force

$srcImage.Dispose()
Write-Output "All icons successfully generated."
