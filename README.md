def count_words(text):
    # .split() automatically handles multiple spaces and newlines
    words = text.split()
    return len(words)

# Paste your essay between the triple quotes
my_essay = """
Enter your essay text here. 
It doesn't matter if there are multiple paragraphs
or weird spacing—the script will handle it!
"""

total_words = count_words(my_essay)
print(f"Total word count: {total_words}")
print("--- Essay Word Counter ---")

# This acts as your "text box" input
essay_input = input("Paste your essay here and press Enter: \n")

# Process the text
word_list = essay_input.split()
count = len(word_list)

print("-" * 26)
print(f"Result: {count} words")
