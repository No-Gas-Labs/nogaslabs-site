#!/bin/sh
# usage: new-press.sh N slug
set -e
if [ "$#" -ne 2 ]; then
  echo "usage: $0 N slug" >&2
  exit 1
fi
N="$1"
SLUG="$2"
FILE="press/${N}-${SLUG}.html"
if [ -f "$FILE" ]; then
  echo "$FILE exists"
  exit 0
fi
DATE=$(date +"%b %d, %Y")
HEAD=$(printf '%s' "$SLUG" | tr '-' ' ' | sed 's/^./\u&/')
TITLE="Press $N - $HEAD"
CANON="https://no-gas-labs.github.io/nogaslabs-site/press/${N}-${SLUG}.html"
sed -e "s/{{TITLE}}/$TITLE/" \
    -e "s/{{HEADLINE}}/$HEAD/" \
    -e "s/{{DATE}}/$DATE/" \
    -e "s|{{CANONICAL}}|$CANON|" \
    -e "s/{{BODY}}/<p>New press release.<\/p>/" \
    press/_TEMPLATE.tpl > "$FILE"
# update index
LINE="    <li><a href=\"./${N}-${SLUG}.html\">${N} - ${HEAD} (${DATE})</a></li>"
if ! grep -q "${N}-${SLUG}.html" press/index.html; then
  sed -i "/<ul>/a\
$LINE" press/index.html
fi
# update feed
if ! grep -q "${N}-${SLUG}.html" press/feed.xml; then
  ed -s press/feed.xml <<END
/<\/channel>/i
  <item>
    <title>${N} - ${HEAD}</title>
    <link>${CANON}</link>
    <pubDate>$(date -R)</pubDate>
    <description>New press release.</description>
    <guid>${N}</guid>
  </item>
.
w
q
END
fi
