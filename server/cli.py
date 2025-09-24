"""
Command-line interface for property scraping
"""

import argparse
import datetime
import os
import sys
from pathlib import Path
from .scraper_api import scrape_property


def main():
    parser = argparse.ArgumentParser(description="Dreamery Property Scraper CLI")
    parser.add_argument("location", type=str, help="Location to scrape (e.g., San Francisco, CA)")

    parser.add_argument(
        "-l",
        "--listing_type",
        type=str,
        default="for_sale",
        choices=["for_sale", "for_rent", "sold", "pending"],
        help="Listing type to scrape",
    )

    parser.add_argument(
        "-t",
        "--return_type",
        type=str,
        default="pandas",
        choices=["pandas", "pydantic", "raw"],
        help="Return type for data",
    )

    parser.add_argument(
        "-o",
        "--output",
        type=str,
        default="excel",
        choices=["excel", "csv", "json"],
        help="Output format",
    )

    parser.add_argument(
        "-f",
        "--filename",
        type=str,
        default=None,
        help="Name of the output file (without extension)",
    )

    parser.add_argument(
        "-pt",
        "--property_type",
        type=str,
        nargs="+",
        default=None,
        choices=[
            "single_family", "apartment", "condos", "condo_townhome_rowhome_coop",
            "condo_townhome", "townhomes", "duplex_triplex", "farm", "land", "multi_family", "mobile"
        ],
        help="Property types to include",
    )

    parser.add_argument("-p", "--proxy", type=str, default=None, help="Proxy to use for scraping")
    parser.add_argument(
        "-d",
        "--days",
        type=int,
        default=None,
        help="Sold/listed in last _ days filter.",
    )

    parser.add_argument(
        "-r",
        "--radius",
        type=float,
        default=None,
        help="Get comparable properties within _ (eg. 0.0) miles. Only applicable for individual addresses.",
    )
    
    parser.add_argument(
        "-m",
        "--mls_only",
        action="store_true",
        help="If set, fetches only MLS listings.",
    )

    parser.add_argument(
        "--foreclosure",
        action="store_true",
        help="If set, fetches only foreclosure listings.",
    )

    parser.add_argument(
        "--extra_data",
        action="store_true",
        default=True,
        help="If set, fetches additional property data (default: True).",
    )

    parser.add_argument(
        "--exclude_pending",
        action="store_true",
        help="If set, excludes pending or contingent properties.",
    )

    parser.add_argument(
        "--limit",
        type=int,
        default=10000,
        help="Limit the number of results returned (default: 10000, max: 10000).",
    )

    parser.add_argument(
        "--date_from",
        type=str,
        default=None,
        help="Start date for filtering (format: YYYY-MM-DD).",
    )

    parser.add_argument(
        "--date_to",
        type=str,
        default=None,
        help="End date for filtering (format: YYYY-MM-DD).",
    )

    parser.add_argument(
        "--output_dir",
        type=str,
        default=".",
        help="Directory to save output files (default: current directory).",
    )

    args = parser.parse_args()

    try:
        print(f"Scraping properties in {args.location}...")
        print(f"Listing type: {args.listing_type}")
        print(f"Return type: {args.return_type}")
        print(f"Output format: {args.output}")
        
        if args.property_type:
            print(f"Property types: {', '.join(args.property_type)}")
        
        if args.radius:
            print(f"Radius: {args.radius} miles")
        
        if args.days:
            print(f"Past days: {args.days}")
        
        if args.mls_only:
            print("MLS only: True")
        
        if args.foreclosure:
            print("Foreclosure only: True")
        
        if args.exclude_pending:
            print("Exclude pending: True")
        
        if args.limit != 10000:
            print(f"Limit: {args.limit}")
        
        if args.date_from or args.date_to:
            print(f"Date range: {args.date_from or 'N/A'} to {args.date_to or 'N/A'}")

        # Call the scraping API
        result = scrape_property(
            location=args.location,
            listing_type=args.listing_type,
            return_type=args.return_type,
            property_type=args.property_type,
            radius=args.radius,
            mls_only=args.mls_only,
            past_days=args.days,
            proxy=args.proxy,
            date_from=args.date_from,
            date_to=args.date_to,
            foreclosure=args.foreclosure,
            extra_property_data=args.extra_data,
            exclude_pending=args.exclude_pending,
            limit=args.limit,
        )

        # Handle different return types
        if args.return_type == "pandas":
            if hasattr(result, 'empty') and result.empty:
                print("No properties found.")
                return
            
            data_count = len(result)
            print(f"Found {data_count} properties")
            
            # Generate filename if not provided
            if not args.filename:
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                location_safe = args.location.replace(" ", "_").replace(",", "").replace(" ", "")
                args.filename = f"DreameryProperties_{location_safe}_{timestamp}"
            
            # Create output directory if it doesn't exist
            output_dir = Path(args.output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Save based on output format
            if args.output == "excel":
                output_filename = output_dir / f"{args.filename}.xlsx"
                result.to_excel(output_filename, index=False)
                print(f"Excel file saved as {output_filename}")
            elif args.output == "csv":
                output_filename = output_dir / f"{args.filename}.csv"
                result.to_csv(output_filename, index=False)
                print(f"CSV file saved as {output_filename}")
            elif args.output == "json":
                output_filename = output_dir / f"{args.filename}.json"
                result.to_json(output_filename, orient='records', indent=2)
                print(f"JSON file saved as {output_filename}")
        
        elif args.return_type == "pydantic":
            if not result:
                print("No properties found.")
                return
            
            data_count = len(result)
            print(f"Found {data_count} properties")
            
            # Generate filename if not provided
            if not args.filename:
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                location_safe = args.location.replace(" ", "_").replace(",", "").replace(" ", "")
                args.filename = f"DreameryProperties_{location_safe}_{timestamp}"
            
            # Create output directory if it doesn't exist
            output_dir = Path(args.output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Convert to dictionaries for export
            data = []
            for property in result:
                if hasattr(property, 'model_dump'):
                    data.append(property.model_dump())
                else:
                    data.append(property)
            
            # Save based on output format
            if args.output == "excel":
                import pandas as pd
                df = pd.DataFrame(data)
                output_filename = output_dir / f"{args.filename}.xlsx"
                df.to_excel(output_filename, index=False)
                print(f"Excel file saved as {output_filename}")
            elif args.output == "csv":
                import pandas as pd
                df = pd.DataFrame(data)
                output_filename = output_dir / f"{args.filename}.csv"
                df.to_csv(output_filename, index=False)
                print(f"CSV file saved as {output_filename}")
            elif args.output == "json":
                import json
                output_filename = output_dir / f"{args.filename}.json"
                with open(output_filename, 'w') as f:
                    json.dump(data, f, indent=2, default=str)
                print(f"JSON file saved as {output_filename}")
        
        else:  # raw
            if not result:
                print("No properties found.")
                return
            
            data_count = len(result) if isinstance(result, list) else 1
            print(f"Found {data_count} properties")
            
            # Generate filename if not provided
            if not args.filename:
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                location_safe = args.location.replace(" ", "_").replace(",", "").replace(" ", "")
                args.filename = f"DreameryProperties_{location_safe}_{timestamp}"
            
            # Create output directory if it doesn't exist
            output_dir = Path(args.output_dir)
            output_dir.mkdir(parents=True, exist_ok=True)
            
            # Save based on output format
            if args.output == "json":
                import json
                output_filename = output_dir / f"{args.filename}.json"
                with open(output_filename, 'w') as f:
                    json.dump(result, f, indent=2, default=str)
                print(f"JSON file saved as {output_filename}")
            else:
                print("Raw data can only be saved as JSON format")
                import json
                output_filename = output_dir / f"{args.filename}.json"
                with open(output_filename, 'w') as f:
                    json.dump(result, f, indent=2, default=str)
                print(f"JSON file saved as {output_filename}")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
