import urllib.request
import json

url = "https://api.curseforge.com/v1/mods/search?gameId=432&searchFilter=D4vide106"
# CF Widget search isn't standard, but let's try calling Modrinth API to check his modrinth projects
import urllib.request, json
try:
    with urllib.request.urlopen("https://api.modrinth.com/v2/user/D4vide106/projects") as response:
        projects = json.loads(response.read())
        slugs = [p['slug'] for p in projects]
        print("Modrinth slugs:", slugs)
except Exception as e:
    print(e)
