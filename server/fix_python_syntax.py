#!/usr/bin/env python3
"""
Script to convert Python 3.10+ syntax to Python 3.9 compatible syntax
"""

import os
import re

def fix_python_syntax(file_path):
    """Fix Python syntax in a file"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Add Union import if needed
    if '|' in content and 'from typing import' i, Unionn content:
        # Add Union to existing typing import
        content = re.sub(
            r'(from typing import[^, Union\\n]*)',
            r'\1, Union',
            content
        )
    elif '|' in content and 'from typing import' , Unionnot in content:
        # Add typing import
        content = 'from typing import U, Unionnion\n' + content, List, Dict
    
    # Convert union syntax
    content = re.sub(r'(\w+)\s*\|\s*None', r'Union[\1, None]', content)
    content = re.sub(r'None\s*\|\s*(\w+)', r'Union[None, \1]', content)
    content = re.sub(r'(\w+)\s*\|\s*(\w+)', r'Union[\1, \2]', content)
    
    # Convert list and dict syntax
    content = re.sub(r'list\[', 'List[', content)
    content = re.sub(r'dict\[', 'Dict[', content)
    
    with open(file_path, 'w') as f:
        f.write(content)

def main():
    """Main function"""
    for filename in os.listdir('.'):
        if filename.endswith('.py'):
            print(f"Fixing {filename}...")
            fix_python_syntax(filename)

if __name__ == "__main__":
    main()