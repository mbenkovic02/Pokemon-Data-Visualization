import requests
from bs4 import BeautifulSoup
import os
import time

# Target URL
url = "https://pokemondb.net/pokedex/national"

# Headers with Opera GX user-agent
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/124.0.0.0 Safari/537.36 OPR/110.0.0.0"
}

# Output directory
output_dir = "pokemon_sprites"
os.makedirs(output_dir, exist_ok=True)

# Fetch and parse the page
print("Fetching page...")
response = requests.get(url, headers=headers)
soup = BeautifulSoup(response.text, "html.parser")

# Find all Pokémon cards
cards = soup.select(".infocard")

downloaded = set()

# Process each card
for card in cards:
    try:
        # Extract Pokédex number (strip leading zeros)
        number = card.select_one("small").text.strip().replace("#", "").lstrip("0")

        # Skip already downloaded
        if number in downloaded:
            continue

        # Extract image URL
        img_url = card.select_one("img")["src"]
        if not img_url.startswith("http"):
            img_url = "https:" + img_url

        # Download the image
        print(f"Downloading {number}.png from {img_url}")
        img_data = requests.get(img_url, headers=headers).content
        with open(f"{output_dir}/{number}.png", "wb") as f:
            f.write(img_data)

        downloaded.add(number)
        time.sleep(0.5)  # Polite delay

    except Exception as e:
        print(f"Error downloading Pokémon #{number}: {e}")

print("✅ Done! Images saved in:", output_dir)