"""从廉洁月海报中抠出 IP 人物（载具+角色），输出透明 PNG。"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path(
    r"C:\Users\11575\.cursor\projects\d-cursor-develop-Linsy-risk-bill\assets"
    r"\c__Users_11575_AppData_Roaming_Cursor_User_workspaceStorage_936c8599892badc60b5c677156cffd6e_images_image-048a1c40-5100-4ecd-aff4-4ea81682ba52.png"
)
OUT = Path(r"d:\cursor_develop\Linsy_risk_bill\frontend\src\assets\images\char-home.png")
BACKUP = Path(r"d:\cursor_develop\Linsy_risk_bill\frontend\src\assets\images\char-home.bak.png")

# 人物+载具大致区域（排除顶部标题与底部文案）
CROP_BOX = (5, 165, 445, 535)


def color_distance(rgb: np.ndarray, ref: np.ndarray) -> np.ndarray:
    diff = rgb.astype(np.float32) - ref.astype(np.float32)
    return np.sqrt(np.sum(diff * diff, axis=-1))


def build_mask(rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]

    # 背景参考色：四角 + 边缘采样
    refs = [
        rgb[0, 0],
        rgb[0, w - 1],
        rgb[h - 1, 0],
        rgb[h - 1, w - 1],
        rgb[h // 4, w // 8],
        rgb[h // 3, w - 1 - w // 8],
    ]
    dist = np.min(np.stack([color_distance(rgb, r) for r in refs], axis=0), axis=0)

    # 青绿背景：G、B 偏高
    r, g, b = rgb[:, :, 0].astype(np.float32), rgb[:, :, 1].astype(np.float32), rgb[:, :, 2].astype(np.float32)
    teal_like = (g + b) / 2.0 - r > 18
    bright_teal = (g > 120) & (b > 110) & (r < 170)

    bg = (dist < 42) | (teal_like & bright_teal)

    # 保留高饱和前景（黄/橙载具、披风）
    max_c = rgb.max(axis=2).astype(np.float32)
    min_c = rgb.min(axis=2).astype(np.float32)
    sat = (max_c - min_c) / np.maximum(max_c, 1)
    warm = (r > 150) & (g > 90) & (b < 200)
    fg = (~bg) | (sat > 0.28) | warm

  # 人物主体大致居中，去掉边缘残留背景块
    center_mask = (xx > w * 0.02) & (xx < w * 0.98) & (yy > h * 0.02) & (yy < h * 0.98)
    fg = fg & center_mask

    alpha = (fg.astype(np.uint8) * 255)
    alpha_img = Image.fromarray(alpha, mode="L")
    alpha_img = alpha_img.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    return np.array(alpha_img)


def trim_transparent(img: Image.Image) -> Image.Image:
    arr = np.array(img)
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 12)
    if len(xs) == 0:
        return img
    pad = 4
    left = max(int(xs.min()) - pad, 0)
    top = max(int(ys.min()) - pad, 0)
    right = min(int(xs.max()) + pad + 1, arr.shape[1])
    bottom = min(int(ys.max()) + pad + 1, arr.shape[0])
    return img.crop((left, top, right, bottom))


def main() -> None:
    img = Image.open(SRC).convert("RGBA")
    cropped = img.crop(CROP_BOX)
    rgb = np.array(cropped.convert("RGB"))
    alpha = build_mask(rgb)

    rgba = np.dstack([rgb, alpha])
    result = Image.fromarray(rgba, mode="RGBA")
    result = trim_transparent(result)

    # 统一输出高度，便于首页布局
    target_h = 220
    ratio = target_h / result.height
    target_w = max(1, int(result.width * ratio))
    result = result.resize((target_w, target_h), Image.Resampling.LANCZOS)

    if OUT.exists():
        import shutil

        shutil.copy2(OUT, BACKUP)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    result.save(OUT, optimize=True)
    print(f"saved {OUT} size={result.size}")


if __name__ == "__main__":
    main()
