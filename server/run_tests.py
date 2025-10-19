#!/usr/bin/env python3
"""
Dreamery Property Scraper Test Runner
Run this script to execute the comprehensive test suite for Dreamery property scraping functionality.
"""

import sys
import os
import subprocess
import argparse

def run_tests(test_type="all", verbose=False, coverage=False):
    """Run the test suite with specified options"""
    
    # Add server directory to Python path
    server_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, server_dir)
    
    # Base pytest command
    cmd = ["python", "-m", "pytest"]
    
    # Add verbosity
    if verbose:
        cmd.append("-v")
    else:
        cmd.append("-q")
    
    # Add coverage if requested
    if coverage:
        cmd.extend(["--cov=.", "--cov-report=html", "--cov-report=term"])
    
    # Add test type filtering
    if test_type == "unit":
        cmd.extend(["-m", "unit"])
    elif test_type == "integration":
        cmd.extend(["-m", "integration"])
    elif test_type == "property":
        cmd.extend(["-m", "property_search"])
    elif test_type == "fast":
        cmd.extend(["-m", "not slow"])
    elif test_type == "models":
        cmd.append("tests/test_models.py")
    elif test_type == "scraper":
        cmd.append("tests/test_property_scraper.py")
    else:
        # Run all tests
        cmd.append("tests/")
    
    # Add additional options
    cmd.extend([
        "--tb=short",
        "--disable-warnings"
    ])
    
    print(f"Running command: {' '.join(cmd)}")
    print("-" * 50)
    
    try:
        result = subprocess.run(cmd, cwd=server_dir, check=False)
        return result.returncode
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Run Dreamery property scraper tests")
    parser.add_argument(
        "--type", 
        choices=["all", "unit", "integration", "property", "fast", "models", "scraper"],
        default="all",
        help="Type of tests to run"
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Run tests in verbose mode"
    )
    parser.add_argument(
        "--coverage", "-c",
        action="store_true", 
        help="Run tests with coverage reporting"
    )
    
    args = parser.parse_args()
    
    print("Dreamery Property Scraper Test Suite")
    print("=" * 40)
    print(f"Test type: {args.type}")
    print(f"Verbose: {args.verbose}")
    print(f"Coverage: {args.coverage}")
    print()
    
    exit_code = run_tests(
        test_type=args.type,
        verbose=args.verbose,
        coverage=args.coverage
    )
    
    if exit_code == 0:
        print("\n" + "=" * 40)
        print("All tests passed! ✅")
    else:
        print("\n" + "=" * 40)
        print("Some tests failed! ❌")
    
    sys.exit(exit_code)

if __name__ == "__main__":
    main()
