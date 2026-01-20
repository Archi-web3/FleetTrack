import PyPDF2
import os

def inspect_pdf(pdf_path):
    """
    Print raw text from PDF to understand its structure.
    """
    print(f"\n{'='*60}")
    print(f"Inspecting: {os.path.basename(pdf_path)}")
    print('='*60)
    
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            print(f"Total pages: {len(pdf_reader.pages)}\n")
            
            # Show first 2 pages
            for i, page in enumerate(pdf_reader.pages[:2]):
                print(f"\n--- Page {i+1} ---")
                text = page.extract_text()
                print(text[:1500])  # First 1500 characters
                print("...")
                
    except Exception as e:
        print(f"Error: {e}")

# Inspect the weekly checklist first
pdf_path = r"C:\Users\jonat\Documents\ACF\ACF_v2\Angular\e-logbook\public\assets\manuals\Check List hebdomadaire.pdf"
inspect_pdf(pdf_path)

# Then Service A
pdf_path = r"C:\Users\jonat\Documents\ACF\ACF_v2\Angular\e-logbook\public\assets\manuals\Liste_Service_A.pdf"
inspect_pdf(pdf_path)
