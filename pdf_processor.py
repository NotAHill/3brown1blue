from abc import ABC, abstractmethod
import google.genai as genai
from PyPDF2 import PdfReader
import os
from typing import List, Tuple, Optional
from dataclasses import dataclass

@dataclass
class ProcessingResult:
    is_valid: bool
    relevant_pages: List[int]
    error_message: Optional[str] = None

class LLMProcessor(ABC):
    @abstractmethod
    def process(self, text: str, prompt: str) -> str:
        pass

class GeminiProcessor(LLMProcessor):
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key) 
        self.model = "gemini-2.0-flash"
    
    def process(self, text: str, prompt: str) -> str:
        try:
            # Combine prompt and text properly
            full_prompt = f"{prompt}\n\nText to analyze:\n{text}"
            response = self.model.generate_content(
                model=self.model,
                content=full_prompt
            )
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API call failed: {str(e)}")

class PDFProcessor:
    def __init__(self, llm_processor: LLMProcessor):
        self.llm_processor = llm_processor
    
    def extract_text_from_pdf(self, pdf_file) -> List[Tuple[int, str]]:
        """Extract text from each page of the PDF."""
        try:
            reader = PdfReader(pdf_file)
            return [(i, page.extract_text()) for i, page in enumerate(reader.pages)]
        except Exception as e:
            raise Exception(f"PDF reading failed: {str(e)}")
    
    def check_topic_relevance(self, pdf_text: List[Tuple[int, str]], topic: str) -> ProcessingResult:
        """Stage 1: Check if the topic is relevant to the PDF content."""
        try:
            # Limit text length to avoid context window issues
            combined_text = "\n".join([f"Page {i+1}: {text[:1000]}..." for i, text in pdf_text])
            
            prompt = f"""
            Analyze if the following topic is discussed in the provided text. 
            Topic: {topic}
            
            Respond with ONLY 'YES' if the topic is found, or 'NO' if it's not found.
            Do not include any other text in your response.
            """
            
            response = self.llm_processor.process(combined_text, prompt)
            # More robust response parsing
            is_valid = 'yes' in response.strip().lower()
            
            if not is_valid:
                return ProcessingResult(
                    is_valid=False,
                    relevant_pages=[],
                    error_message=f"Topic '{topic}' not found in the document"
                )
            
            return ProcessingResult(is_valid=True, relevant_pages=[])
        
        except Exception as e:
            return ProcessingResult(
                is_valid=False,
                relevant_pages=[],
                error_message=f"Error checking topic relevance: {str(e)}"
            )
    
    def identify_relevant_pages(self, pdf_text: List[Tuple[int, str]], topic: str) -> ProcessingResult:
        """Stage 2: Identify pages relevant to the topic."""
        relevant_pages = []
        
        try:
            for page_num, text in pdf_text:
                # Limit text length per page
                truncated_text = text[:2000] if len(text) > 2000 else text
                
                prompt = f"""
                Analyze if the following text from page {page_num + 1} is relevant to the topic: {topic}
                
                Respond with ONLY 'YES' if the page is relevant, or 'NO' if it's not relevant.
                Do not include any other text in your response.
                """
                
                response = self.llm_processor.process(truncated_text, prompt)
                if 'yes' in response.strip().lower():
                    relevant_pages.append(page_num + 1)
            
            return ProcessingResult(
                is_valid=True,
                relevant_pages=relevant_pages
            )
        
        except Exception as e:
            return ProcessingResult(
                is_valid=False,
                relevant_pages=[],
                error_message=f"Error identifying relevant pages: {str(e)}"
            )
    
    def process_pdf(self, pdf_file, topic: str) -> ProcessingResult:
        """Main processing workflow."""
        try:
            # Extract text from PDF
            pdf_text = self.extract_text_from_pdf(pdf_file)
            
            # Stage 1: Check topic relevance
            relevance_check = self.check_topic_relevance(pdf_text, topic)
            if not relevance_check.is_valid:
                return relevance_check
            
            # Stage 2: Identify relevant pages
            return self.identify_relevant_pages(pdf_text, topic)
        
        except Exception as e:
            return ProcessingResult(
                is_valid=False,
                relevant_pages=[],
                error_message=f"PDF processing failed: {str(e)}"
            )

# Usage example:
if __name__ == "__main__":
    processor = GeminiProcessor(api_key)
    pdf_processor = PDFProcessor(processor)
    
    # Process a PDF
    with open("your_document.pdf", "rb") as pdf_file:
        result = pdf_processor.process_pdf(pdf_file, "machine learning")
        print(f"Valid: {result.is_valid}")
        print(f"Relevant pages: {result.relevant_pages}")
        if result.error_message:
            print(f"Error: {result.error_message}")