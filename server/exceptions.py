"""
Custom exceptions for the scraper
"""

class AuthenticationError(Exception):
    """Raised when authentication fails"""
    
    def __init__(self, message: str, response=None):
        super().__init__(message)
        self.response = response


class ScrapingError(Exception):
    """Raised when scraping fails"""
    
    def __init__(self, message: str, response=None):
        super().__init__(message)
        self.response = response


class ValidationError(Exception):
    """Raised when input validation fails"""
    
    def __init__(self, message: str, field=None):
        super().__init__(message)
        self.field = field


class RateLimitError(Exception):
    """Raised when rate limit is exceeded"""
    
    def __init__(self, message: str, retry_after=None):
        super().__init__(message)
        self.retry_after = retry_after


class InvalidListingType(Exception):
    """Raised when a provided listing type is does not exist."""


class InvalidDate(Exception):
    """Raised when only one of date_from or date_to is provided or not in the correct format. ex: 2023-10-23"""
