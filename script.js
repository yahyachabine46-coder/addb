print("--- Essay Word Counter ---")

# This acts as your "text box" input
essay_input = input("Paste your essay here and press Enter: \n")

# Process the text
word_list = essay_input.split()
count = len(word_list)

print("-" * 26)
print(f"Result: {count} words")
