# Brand and Model Implementation

## Overview
This document describes the implementation of dynamic brand and model selection with search functionality in the CarListingSection component.

## Changes Made

### 1. New Combobox Component
- Created `client/components/ui/combobox.tsx`
- Provides searchable select functionality using the Command component
- Maintains consistent styling with the original design
- Supports disabled state for dependent selects

### 2. Updated CarListingSection Component
- Replaced hardcoded Select components with dynamic Combobox components
- Added state management for brands and models
- Implemented proper relationship handling (model selection depends on brand selection)
- Added error handling for API calls

### 3. Enhanced API Endpoints
- Updated `server/routes/model.ts` to support fetching all models with `brand_id=all`
- Maintained backward compatibility with existing brand-specific model queries
- Added proper error handling

## Features

### Brand Selection
- Fetches brands from `/api/brands` endpoint
- Searchable dropdown with Estonian placeholder text
- Maintains original styling (font, colors, dimensions)

### Model Selection
- Fetches models from `/api/models` endpoint
- Filtered based on selected brand
- Disabled when no brand is selected
- Clears selection when brand changes
- Searchable dropdown with Estonian placeholder text

### Styling Consistency
- Maintains original height: `h-[43px]`
- Preserves background color: `bg-[#f6f7f9]`
- Keeps font family: `font-['Poppins',Helvetica]`
- Maintains text color: `text-[#747474]`

## API Endpoints

### GET /api/brands
Returns all brands ordered by name:
```json
[
  { "id": 1, "name": "BMW" },
  { "id": 2, "name": "Mercedes" },
  ...
]
```

### GET /api/models?brand_id=123
Returns models for a specific brand:
```json
[
  { "id": 1, "name": "X5" },
  { "id": 2, "name": "X3" },
  ...
]
```

### GET /api/models?brand_id=all
Returns all models with brand_id for filtering:
```json
[
  { "id": 1, "name": "X5", "brand_id": 1 },
  { "id": 2, "name": "X3", "brand_id": 1 },
  { "id": 3, "name": "C-Class", "brand_id": 2 },
  ...
]
```

## Database Structure
The implementation relies on existing database tables:
- `brand` table with `id` and `name` columns
- `model` table with `id`, `name`, and `brand_id` columns
- Proper foreign key relationships are already established

## Testing
Updated `test-api.js` to include tests for:
- Brands endpoint
- Models endpoint (all models)
- Models endpoint (brand-specific)

Run tests with:
```bash
node test-api.js
```

## Dependencies
- `cmdk` - Already installed for Command component functionality
- `@radix-ui/react-popover` - Already installed for Popover component
- `lucide-react` - Already installed for icons 