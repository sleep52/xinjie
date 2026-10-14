Add-Type -AssemblyName System.Drawing
$dir = "D:\games\xinjie-uniapp\src\static"
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$p = New-Object System.Drawing.Imaging.EncoderParameters 1
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]80)
$specs = @(
  @{n="bg-splash"; w=720},
  @{n="p-a"; w=540}, @{n="p-b"; w=540}, @{n="p-c"; w=540}, @{n="p-d"; w=720}, @{n="p-e"; w=540}, @{n="p-f"; w=540},
  @{n="live"; w=720},
  @{n="a1"; w=512}, @{n="a2"; w=512}, @{n="a3"; w=512}
)
foreach ($s in $specs) {
  $src = Join-Path $dir ($s.n + ".png")
  if (-not (Test-Path $src)) { continue }
  $img = [System.Drawing.Image]::FromFile($src)
  $ratio = $s.w / $img.Width
  $w = [int]$s.w; $h = [int]($img.Height * $ratio)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $g.Dispose(); $img.Dispose()
  $dst = Join-Path $dir ($s.n + ".jpg")
  $bmp.Save($dst, $codec, $p)
  $bmp.Dispose()
  Remove-Item $src
}
Get-ChildItem $dir | ForEach-Object { "{0} {1:N0}" -f $_.Name, $_.Length }
