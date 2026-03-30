def count_words_in_file(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            content = file.read()
            words = content.split()
            return len(words)
    except FileNotFoundError:
        return "File not found. Please check the path."

# Usage
file_name = "essay.txt" 
print(f"Word count: {count_words_in_file(file_name)}")
