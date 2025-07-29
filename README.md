# No_Gas_Labs — Official Shrine

Static site for press releases, relics, and campaign info.

Value proposition: Rebuild what breaks people and share the fixes.

## Develop locally
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Structure

index.html, about.html

press/, relics/, campaign/

site.css, site.js

.nojekyll, 404.html

Deploy

Enable GitHub Pages: Settings → Pages → Source: main / root.
Site: https://no-gas-labs.github.io/nogaslabs-site/.

Site map
- Home
- About
- Press (001 live)
- Relics
- Campaign
- Press Kit
- [RSS Feed](https://no-gas-labs.github.io/nogaslabs-site/press/feed.xml)
- [Press Kit](https://no-gas-labs.github.io/nogaslabs-site/press/kit.html)

Scripts
- `scripts/new-press.sh` helps create and index new press releases.
