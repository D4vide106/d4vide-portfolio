import urllib.request
import urllib.parse
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def test_url(url):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=3) as resp:
            content_type = resp.headers.get('content-type', '')
            length = len(resp.read(50000))
            if 'image' in content_type and length > 500:
                return True, content_type, length
    except Exception as e:
        return False, str(e), 0
    return False, 'not image', 0

candidates = {
    'BisectHosting': [
        'https://images.opencollective.com/bisecthosting/e1e19d7/logo/256.png',
        'https://www.bisecthosting.com/partners/custom-banners/814a27b4-a2bb-4f4f-ab8b-ee7a2496a81a.webp',
        'https://media.discordapp.net/attachments/1118128362707923055/1218153406322802778/bisecthosting_logo.png',
        'https://cdn.worldvectorlogo.com/logos/bisecthosting.svg',
        'https://img.utdstc.com/icon/814/a27/814a27b4.png',
        'https://pbs.twimg.com/profile_images/1749826330064375808/yU2t0K0C_400x400.jpg',
        'https://pbs.twimg.com/profile_images/1681711200026210304/7qj4E2yQ_400x400.jpg',
        'https://play-lh.googleusercontent.com/yF-k1gUq0g4xXjH8w4v1v-q1_3b9=w240-h480'
    ],
    'InstantGaming': [
        'https://gaming-cdn.com/themes/igv8/modules/common/images/icon-logo.png',
        'https://gaming-cdn.com/themes/igv8/modules/common/images/logo-instant-gaming.svg',
        'https://pbs.twimg.com/profile_images/1582314545934520320/rT5TzX3B_400x400.jpg',
        'https://pbs.twimg.com/profile_images/1513813955621695488/j8K7y7n3_400x400.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/6/6b/Instant-Gaming_Logo.svg'
    ],
    'Amazon': [
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png',
        'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg',
        'https://cdn.icon-icons.com/icons2/2699/PNG/512/amazon_logo_icon_169612.png'
    ],
    'G2A': [
        'https://pbs.twimg.com/profile_images/1529402482329620480/vG9E4J6e_400x400.jpg',
        'https://images.g2a.com/uiadminimages/500x500/1x1x1/89bbad1005a7/89bbad1005a7_logo.png',
        'https://pbs.twimg.com/profile_images/1643194098650890240/fQv0Y5yP_400x400.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/G2A_logo.svg/512px-G2A_logo.svg.png'
    ],
    'Fiverr': [
        'https://images.opencollective.com/fiverr/logo/256.png',
        'https://pbs.twimg.com/profile_images/1410220677467320323/xU64F0Jt_400x400.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Fiverr_Logo_Flag.svg/512px-Fiverr_Logo_Flag.svg.png'
    ]
}

for brand, list_urls in candidates.items():
    print(f"=== {brand} ===")
    for u in list_urls:
        ok, info, l = test_url(u)
        print(f"[{'OK' if ok else 'FAIL'}] {u} ({info})")
