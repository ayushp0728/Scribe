import os
import subprocess
import re

def send_request_to_ollama(text, model_name="deepseek-r1:1.5b"):
    """
    Sends a request to Ollama with a given prompt and extracts only the final summary.
    Adjusted for full paragraph output while maintaining academic/student tone.
    """
    command = ["ollama", "run", model_name]

    try:
        # Run Ollama and enforce UTF-8 encoding to prevent UnicodeDecodeError
        process = subprocess.run(
            command,
            input="Summarize this text into a clear and structured paragraph (4-5 sentences). Maintain an academic tone: " + text,
            text=True,
            capture_output=True,
            shell=True,
            encoding="utf-8",  # ✅ Forces UTF-8 encoding to fix errors
            check=True
        )

        output = process.stdout.strip()

        # 🔹 Use regex to extract the most structured paragraph from the output
        paragraphs = re.split(r"\n\s*\n", output)  # Split paragraphs

        if paragraphs:
            return paragraphs[-1]  # ✅ Return last meaningful paragraph
        else:
            # 🔹 Fallback: Extract last few sentences (4-5)
            sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', output)
            return " ".join(sentences[-5:]) if len(sentences) > 5 else output  # Ensure full paragraph

    except subprocess.CalledProcessError as e:
        return f"❌ Error: Ollama command failed.\n{e}"

# 🔹 Main function to get user input and send request
if __name__ == "__main__":
    # Test case (hardcoded for debugging)
    text = "In the mundane world, Eve Ocotillo plays a scientist. She escapes from the grind by conjuring tough and conflicted men and then throwing them at each other in romantic and not-so-romantic situations. Her stories range from alternate history to contemporary to science fiction and are influenced by her interest in diverse social issues, her fascination with the natural environment, and her fundamentalist upbringing. She doesn’t much like TV, but her Xbox and a new RPG can suck her in for weeks at a time."
    response = send_request_to_ollama(text, "deepseek-r1:1.5b")
    print(response)
