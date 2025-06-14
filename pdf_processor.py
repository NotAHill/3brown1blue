from abc import ABC, abstractmethod
import google.generativeai as genai
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
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def process(self, text: str, prompt: str) -> str:
        response = self.model.generate_content([text, prompt])
        return response.text

class PDFProcessor:
    def __init__(self, llm_processor: LLMProcessor):
        self.llm_processor = llm_processor

    def extract_text_from_pdf(self, pdf_file) -> List[Tuple[int, str]]:
        """Extract text from each page of the PDF."""
        reader = PdfReader(pdf_file)
        return [(i, page.extract_text()) for i, page in enumerate(reader.pages)]

    def check_topic_relevance(self, pdf_text: List[Tuple[int, str]], topic: str) -> ProcessingResult:
        """Stage 1: Check if the topic is relevant to the PDF content."""
        combined_text = "\n".join([f"Page {i+1}: {text}" for i, text in pdf_text])
        prompt = f"""
        Analyze if the following topic is discussed in the provided text. 
        Topic: {topic}
        
        Respond with ONLY 'YES' if the topic is found, or 'NO' if it's not found.
        Do not include any other text in your response.
        """
        
        response = self.llm_processor.process(combined_text, prompt)
        is_valid = response.strip().upper() == 'YES'
        
        if not is_valid:
            return ProcessingResult(
                is_valid=False,
                relevant_pages=[],
                error_message=f"Topic '{topic}' not found in the document"
            )
        
        return ProcessingResult(is_valid=True, relevant_pages=[])

    def identify_relevant_pages(self, pdf_text: List[Tuple[int, str]], topic: str) -> ProcessingResult:
        """Stage 2: Identify pages relevant to the topic."""
        relevant_pages = []
        
        for page_num, text in pdf_text:
            prompt = f"""
            Analyze if the following text from page {page_num + 1} is relevant to the topic: {topic}
            
            Text:
            {text}
            
            Respond with ONLY 'YES' if the page is relevant, or 'NO' if it's not relevant.
            Do not include any other text in your response.
            """
            
            response = self.llm_processor.process(text, prompt)
            if response.strip().upper() == 'YES':
                relevant_pages.append(page_num + 1)
        
        return ProcessingResult(
            is_valid=True,
            relevant_pages=relevant_pages
        )

    def process_pdf(self, pdf_file, topic: str) -> ProcessingResult:
        """Main processing workflow."""
        # Extract text from PDF
        pdf_text = self.extract_text_from_pdf(pdf_file)
        
        # Stage 1: Check topic relevance
        relevance_check = self.check_topic_relevance(pdf_text, topic)
        if not relevance_check.is_valid:
            return relevance_check
        
        # Stage 2: Identify relevant pages
        return self.identify_relevant_pages(pdf_text, topic) 