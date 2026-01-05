#!/usr/bin/env bash
# Usage: ./scripts/test-upload.sh /path/to/file.jpg
# Make sure your server is running on http://localhost:3000 (adjust as needed)
# Example:
# ./scripts/test-upload.sh ./example.jpg

FILE_PATH="$1"
if [ -z "$FILE_PATH" ]; then
  echo "Usage: $0 /path/to/file"
  exit 1
fi

curl -v -X POST \
  -F "file=@${FILE_PATH}" \
  -F "type=IMAGE" \
  http://localhost:3000/api/media/upload

# To fetch by id (replace 123):
# curl -v http://localhost:3000/api/media/123
