import fitz
import os

def extract_text(pdf_file, out_file):
    if not os.path.exists(pdf_file):
        print(f"File not found: {pdf_file}")
        return
    doc = fitz.open(pdf_file)
    text = "\n".join([page.get_text() for page in doc])
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(text)
    doc.close()
    print(f"Extracted {pdf_file} to {out_file}")

if __name__ == "__main__":
    extract_text("01 - BATERIA/Treinamento Baterias Intermediário.pdf", "bateria_intermediario.txt")
    extract_text("01 - BATERIA/Treinamento Baterias Avançado.pdf", "bateria_avancado.txt")
