import urllib.request
import re

def get_brandfetch_logo(domain):
    url = f"https://brandfetch.com/{domain}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        html = urllib.request.urlopen(req, timeout=5).read().decode("utf-8")
        # Look for images or logos
        logos = re.findall(r"https://asset\.brandfetch\.io/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+\.(?:png|jpeg|jpg)", html)
        return list(set(logos))
    except Exception as e:
        return [str(e)]

print("Bisect:", get_brandfetch_logo("bisecthosting.com"))
print("IG:", get_brandfetch_logo("instant-gaming.com"))
print("G2A:", get_brandfetch_logo("g2a.com"))
print("Amazon:", get_brandfetch_logo("amazon.com"))
print("Fiverr:", get_brandfetch_logo("fiverr.com"))
