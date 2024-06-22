import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter

def generate_docs_from_pdf(pdf_path):
    # Open and read the PDF file
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)

        # Extract text from each page
        full_text = ""
        for page_num in range(num_pages):
            page = reader.pages[page_num]
            full_text += page.extract_text()

    # Split the text into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(full_text)
    
    return chunks
