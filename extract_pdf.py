import PyPDF2
import sys
import os

pdf_path = r"C:\Users\emilly.kerber\Downloads\Grupos de Produtos\Grupos de Produtos\01 - BATERIA\Treinamento Baterias Básico.pdf"

if not os.path.exists(pdf_path):
    print("File not found:", pdf_path)
    sys.exit(1)

text = ""
with open(pdf_path, "rb") as f:
    reader = PyPDF2.PdfReader(f)
    for i in range(len(reader.pages)):
        text += reader.pages[i].extract_text() + "\n\n"

out_path = r"C:\Users\emilly.kerber\Downloads\Grupos de Produtos\Grupos de Produtos\bateria_basico.txt"
with open(out_path, "w", encoding="utf-8") as out_file:
    out_file.write(text)

print("Extraction done. Wrote to", out_path)
