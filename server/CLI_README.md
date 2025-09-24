# Dreamery Property Scraper CLI

A command-line interface for scraping property data from Realtor.com with comprehensive filtering and export options.

## Installation

1. **Install Python Dependencies**:
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Make CLI Script Executable** (optional):
   ```bash
   chmod +x scrape_properties.sh
   ```

## Usage

### Basic Usage

```bash
# Scrape properties for sale in San Francisco
python3 run_cli.py "San Francisco, CA"

# Scrape properties for rent in New York
python3 run_cli.py "New York, NY" --listing_type for_rent

# Scrape sold properties in Los Angeles
python3 run_cli.py "Los Angeles, CA" --listing_type sold
```

### Using the Shell Script

```bash
# Using the shell script (recommended)
./scrape_properties.sh "San Francisco, CA"

# With additional options
./scrape_properties.sh "San Francisco, CA" --listing_type for_rent --output csv
```

## Command Line Options

### Required Arguments

- `location`: Location to scrape (e.g., "San Francisco, CA", "90210", "123 Main St")

### Optional Arguments

#### Basic Options
- `-l, --listing_type`: Listing type to scrape
  - Choices: `for_sale`, `for_rent`, `sold`, `pending`
  - Default: `for_sale`

- `-t, --return_type`: Return type for data
  - Choices: `pandas`, `pydantic`, `raw`
  - Default: `pandas`

- `-o, --output`: Output format
  - Choices: `excel`, `csv`, `json`
  - Default: `excel`

- `-f, --filename`: Name of the output file (without extension)
  - Default: Auto-generated with timestamp

#### Property Filtering
- `-pt, --property_type`: Property types to include
  - Choices: `single_family`, `apartment`, `condos`, `condo_townhome_rowhome_coop`, `condo_townhome`, `townhomes`, `duplex_triplex`, `farm`, `land`, `multi_family`, `mobile`
  - Example: `--property_type single_family condos`

- `-r, --radius`: Get properties within specified miles (for individual addresses)
  - Example: `--radius 5.0`

- `-d, --days`: Properties sold/listed in last N days
  - Example: `--days 30`

- `--date_from`: Start date for filtering (YYYY-MM-DD format)
  - Example: `--date_from 2024-01-01`

- `--date_to`: End date for filtering (YYYY-MM-DD format)
  - Example: `--date_to 2024-12-31`

#### Advanced Options
- `-m, --mls_only`: Fetch only MLS listings
- `--foreclosure`: Fetch only foreclosure listings
- `--extra_data`: Fetch additional property data (default: True)
- `--exclude_pending`: Exclude pending or contingent properties
- `--limit`: Limit number of results (default: 10000, max: 10000)
- `-p, --proxy`: Proxy to use for scraping
- `--output_dir`: Directory to save output files (default: current directory)

## Examples

### Basic Property Scraping

```bash
# Scrape properties for sale in San Francisco
python3 run_cli.py "San Francisco, CA"

# Scrape properties for rent in Miami
python3 run_cli.py "Miami, FL" --listing_type for_rent

# Scrape sold properties in Austin
python3 run_cli.py "Austin, TX" --listing_type sold
```

### Advanced Filtering

```bash
# Scrape single family homes and condos within 5 miles
python3 run_cli.py "123 Main St, San Francisco, CA" \
  --property_type single_family condos \
  --radius 5.0

# Scrape properties listed in the last 30 days
python3 run_cli.py "Seattle, WA" --days 30

# Scrape properties with date range
python3 run_cli.py "Portland, OR" \
  --date_from 2024-01-01 \
  --date_to 2024-06-30

# Scrape only MLS listings
python3 run_cli.py "Denver, CO" --mls_only

# Scrape foreclosures only
python3 run_cli.py "Detroit, MI" --foreclosure
```

### Output Formats

```bash
# Export as Excel (default)
python3 run_cli.py "San Francisco, CA" --output excel

# Export as CSV
python3 run_cli.py "San Francisco, CA" --output csv

# Export as JSON
python3 run_cli.py "San Francisco, CA" --output json

# Custom filename
python3 run_cli.py "San Francisco, CA" \
  --filename "sf_properties_2024" \
  --output excel
```

### Return Types

```bash
# Pandas DataFrame (default) - best for data analysis
python3 run_cli.py "San Francisco, CA" --return_type pandas

# Pydantic models - best for structured data
python3 run_cli.py "San Francisco, CA" --return_type pydantic

# Raw data - best for debugging
python3 run_cli.py "San Francisco, CA" --return_type raw
```

### Comprehensive Example

```bash
# Scrape single family homes and condos for sale in San Francisco
# within 10 miles, listed in the last 60 days, with extra data,
# excluding pending properties, limited to 1000 results,
# exported as Excel with custom filename
python3 run_cli.py "San Francisco, CA" \
  --listing_type for_sale \
  --property_type single_family condos \
  --radius 10.0 \
  --days 60 \
  --extra_data \
  --exclude_pending \
  --limit 1000 \
  --output excel \
  --filename "sf_homes_2024" \
  --output_dir "./exports"
```

## Output Files

### Excel Files (.xlsx)
- **Best for**: Data analysis, sharing with others
- **Features**: Multiple sheets, formatting, charts
- **Columns**: All property fields in organized format

### CSV Files (.csv)
- **Best for**: Importing into other systems
- **Features**: Simple, universal format
- **Columns**: All property fields in comma-separated format

### JSON Files (.json)
- **Best for**: Programming, API integration
- **Features**: Structured data, nested objects
- **Format**: Array of property objects with full structure

## File Naming

If no filename is provided, files are automatically named using the format:
```
DreameryProperties_{Location}_{Timestamp}.{extension}
```

Example: `DreameryProperties_San_Francisco_CA_20241201_143022.xlsx`

## Error Handling

The CLI provides comprehensive error handling:

- **Validation Errors**: Invalid parameters or formats
- **Network Errors**: Connection issues with Realtor.com
- **Data Errors**: Issues processing scraped data
- **File Errors**: Problems saving output files

All errors are displayed with helpful messages and the process exits with code 1.

## Performance Tips

1. **Use Appropriate Limits**: Set `--limit` to avoid overwhelming the system
2. **Filter by Property Type**: Use `--property_type` to reduce irrelevant results
3. **Use Date Filters**: Use `--days` or date ranges to limit data volume
4. **Choose Output Format**: Excel is slower for large datasets, CSV is faster
5. **Use Radius Sparingly**: Radius searches are more resource-intensive

## Troubleshooting

### Common Issues

1. **"No properties found"**
   - Check if the location is valid
   - Try a broader search area
   - Check if the listing type has properties available

2. **"Validation error"**
   - Check parameter formats (especially dates)
   - Ensure property types are valid
   - Check limit is within bounds (max 10000)

3. **"Network error"**
   - Check internet connection
   - Try using a proxy with `--proxy`
   - Wait a moment and try again

4. **"File error"**
   - Check write permissions in output directory
   - Ensure sufficient disk space
   - Check if file is already open

### Getting Help

```bash
# Show help message
python3 run_cli.py --help

# Show version
python3 run_cli.py --version
```

## Integration with Other Tools

The CLI can be integrated with other tools and scripts:

```bash
# Pipe to other commands
python3 run_cli.py "San Francisco, CA" --output csv | head -10

# Use in shell scripts
#!/bin/bash
LOCATIONS=("San Francisco, CA" "New York, NY" "Los Angeles, CA")
for location in "${LOCATIONS[@]}"; do
    python3 run_cli.py "$location" --output csv --filename "${location//, /_}"
done

# Schedule with cron
# 0 9 * * 1 python3 /path/to/run_cli.py "San Francisco, CA" --output csv
```

## License

This CLI is part of the Dreamery homepage project and follows the same license terms.
