import fitz  # PyMuPDF
import os
import io
from PIL import Image

def extract_images_from_pdfs(base_dir):
    output_base = os.path.join(base_dir, "PortalTreinamentos", "public", "images")
    if not os.path.exists(output_base):
        os.makedirs(output_base)

    # Folders to process
    folders = [
        "01 - BATERIA",
        "02 - FONTES",
        "03 - TELAS",
        "04 - TECLADO",
        "05 - MEMÓRIA",
        "06 - SSD"
    ]

    for folder in folders:
        folder_path = os.path.join(base_dir, folder)
        if not os.path.exists(folder_path):
            continue
        
        module_name = folder.split(" - ")[-1].lower().replace(" ", "_")
        module_output = os.path.join(output_base, module_name)
        if not os.path.exists(module_output):
            os.makedirs(module_output)

        for file in os.listdir(folder_path):
            if file.endswith(".pdf"):
                pdf_path = os.path.join(folder_path, file)
                level_name = file.replace("Treinamento ", "").replace(".pdf", "").lower().replace(" ", "_")
                
                print(f"Processing {pdf_path}...")
                doc = fitz.open(pdf_path)
                
                img_count = 0
                for page_index in range(len(doc)):
                    page = doc[page_index]
                    image_list = page.get_images(full=True)
                    
                    for img_index, img in enumerate(image_list):
                        xref = img[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        image_ext = base_image["ext"]
                        
                        image = Image.open(io.BytesIO(image_bytes))
                        # Save image
                        img_filename = f"{level_name}_p{page_index+1}_i{img_index+1}.{image_ext}"
                        image.save(os.path.join(module_output, img_filename))
                        img_count += 1
                
                doc.close()
                print(f"Extracted {img_count} images from {file}")

if __name__ == "__main__":
    base_directory = os.getcwd()
    extract_images_from_pdfs(base_directory)
