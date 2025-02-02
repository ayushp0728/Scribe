import zipfile

# Define the source files
source_files = ['main.py', 'requirements.txt']
destination_zip = 'function-source.zip'

# Create the ZIP file
with zipfile.ZipFile(destination_zip, 'w') as zipf:
    for file in source_files:
        zipf.write(file)

print(f'{source_files} have been zipped into {destination_zip}')
