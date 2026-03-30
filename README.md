print("Paste your essay below. To finish and count, press Ctrl+D (Unix) or Ctrl+Z (Windows) then Enter:")

import sys

# This reads everything until it hits an "End of File" signal
essay_data = sys.stdin.read()

words = essay_data.split()
print(f"\nTotal word count: {len(words)}")
