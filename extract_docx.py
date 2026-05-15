import docx
import sys
import os

docx_path = r"C:\Users\emilly.kerber\Downloads\Grupos de Produtos\Grupos de Produtos\Manual Técnico de Marketing de Produto_ Bateria.docx"

if not os.path.exists(docx_path):
    print("File not found:", docx_path)
    sys.exit(1)

doc = docx.Document(docx_path)
text = []
for para in doc.paragraphs:
    if para.text.strip():
        text.append(para.text.strip())

out_path = r"C:\Users\emilly.kerber\Downloads\Grupos de Produtos\Grupos de Produtos\bateria_manual.txt"
with open(out_path, "w", encoding="utf-8") as out_file:
    out_file.write("\n\n".join(text))

print("Extraction done. Wrote to", out_path)
