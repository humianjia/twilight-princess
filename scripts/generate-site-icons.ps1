param(
  [string]$OutputDir = (Get-Location).Path
)

Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public static class NativeIcon {
  [DllImport("user32.dll", CharSet = CharSet.Auto)]
  public static extern bool DestroyIcon(IntPtr handle);
}
"@

function New-RoundedRectPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-IconBitmap {
  param(
    [int]$Size
  )

  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $bgTop = [System.Drawing.ColorTranslator]::FromHtml("#173227")
  $bgBottom = [System.Drawing.ColorTranslator]::FromHtml("#254b3f")
  $borderColor = [System.Drawing.ColorTranslator]::FromHtml("#d9b464")
  $textColor = [System.Drawing.ColorTranslator]::FromHtml("#f5efe1")
  $shadowColor = [System.Drawing.Color]::FromArgb(70, 0, 0, 0)

  $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $bgTop, $bgBottom, 45
  $graphics.FillRectangle($backgroundBrush, $rect)

  $path = New-RoundedRectPath -X 2 -Y 2 -Width ($Size - 4) -Height ($Size - 4) -Radius ($Size * 0.18)
  $borderPen = New-Object System.Drawing.Pen $borderColor, ([Math]::Max(1, $Size * 0.045))
  $borderPen.Alignment = [System.Drawing.Drawing2D.PenAlignment]::Inset
  $graphics.DrawPath($borderPen, $path)

  $moonBrush = New-Object System.Drawing.SolidBrush $borderColor
  $moonCoverBrush = New-Object System.Drawing.SolidBrush $bgBottom
  $graphics.FillEllipse($moonBrush, $Size * 0.17, $Size * 0.16, $Size * 0.34, $Size * 0.34)
  $graphics.FillEllipse($moonCoverBrush, $Size * 0.25, $Size * 0.13, $Size * 0.34, $Size * 0.34)

  $fontSize = [Math]::Max(8, $Size * 0.37)
  $font = New-Object System.Drawing.Font "Georgia", $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $stringFormat = New-Object System.Drawing.StringFormat
  $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
  $stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

  $shadowBrush = New-Object System.Drawing.SolidBrush $shadowColor
  $textBrush = New-Object System.Drawing.SolidBrush $textColor
  $shadowRect = New-Object System.Drawing.RectangleF ($Size * 0.02), ($Size * 0.34), ($Size * 0.96), ($Size * 0.42)
  $textRect = New-Object System.Drawing.RectangleF 0, ($Size * 0.32), $Size, ($Size * 0.42)

  $graphics.DrawString("TP", $font, $shadowBrush, $shadowRect, $stringFormat)
  $graphics.DrawString("TP", $font, $textBrush, $textRect, $stringFormat)

  $stringFormat.Dispose()
  $textBrush.Dispose()
  $shadowBrush.Dispose()
  $moonCoverBrush.Dispose()
  $moonBrush.Dispose()
  $borderPen.Dispose()
  $path.Dispose()
  $backgroundBrush.Dispose()
  $font.Dispose()
  $graphics.Dispose()

  return $bitmap
}

$iconSpecs = @(
  @{ File = "favicon-16x16.png"; Size = 16 },
  @{ File = "favicon-32x32.png"; Size = 32 },
  @{ File = "favicon-48x48.png"; Size = 48 },
  @{ File = "apple-touch-icon.png"; Size = 180 },
  @{ File = "android-chrome-192x192.png"; Size = 192 },
  @{ File = "android-chrome-512x512.png"; Size = 512 }
)

foreach ($spec in $iconSpecs) {
  $bitmap = New-IconBitmap -Size $spec.Size
  $outPath = Join-Path $OutputDir $spec.File
  $bitmap.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

$icoBitmap = New-IconBitmap -Size 64
$iconHandle = $icoBitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$iconStream = [System.IO.File]::Create((Join-Path $OutputDir "favicon.ico"))
$icon.Save($iconStream)
$iconStream.Dispose()
$icon.Dispose()
[NativeIcon]::DestroyIcon($iconHandle) | Out-Null
$icoBitmap.Dispose()
