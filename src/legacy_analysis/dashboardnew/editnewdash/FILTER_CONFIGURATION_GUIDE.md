# Filter Configuration Guide for Dashboard Editor

## Overview
This guide explains how to configure filters for chart components using the dashboard editor. The filter functionality allows users to dynamically filter chart data using multiple filter types.

## Enabling Filters

To enable filters for a chart component:

1. Open the chart configuration modal by clicking the edit icon on any chart
2. Scroll down to the "Filter Configuration" section
3. Check the "Enable Filters" checkbox

## Adding Filter Fields

Once filters are enabled, you can add filter fields:

1. Click the "Add Filter Field" button
2. Configure each filter field with the following properties:

### Filter Field Properties

#### Field Name
- The field name to filter on (e.g., 'category', 'name', 'amount')
- This should match the field name in your data source

#### Display Label (Optional)
- Label to display for this filter in the UI
- If not provided, the field name will be used as the label

#### Filter Type
Choose one of the following filter types:

1. **Text Input**
   - Creates a text input field
   - Users can type to filter data
   - Works with any text-based field

2. **Dropdown**
   - Creates a dropdown selection field
   - Requires a comma-separated list of options
   - Example options: "A,B,C" or "North, South, East, West"

3. **Number Range**
   - Creates two number input fields (min and max)
   - Used for filtering numeric data within a range
   - Example: Filter sales between 100 and 500

#### Dropdown Options (For Dropdown Type Only)
- Comma-separated list of options for dropdown filters
- Example: "Option1,Option2,Option3"
- Each option will appear as a selectable item in the dropdown

## Example Configurations

### Example 1: Simple Text Filter
```
Field Name: name
Display Label: Product Name
Filter Type: Text Input
```

### Example 2: Category Dropdown Filter
```
Field Name: category
Display Label: Category
Filter Type: Dropdown
Dropdown Options: A,B,C,D
```

### Example 3: Sales Amount Range Filter
```
Field Name: amount
Display Label: Sales Amount
Filter Type: Number Range
```

### Example 4: Multiple Filters
You can combine multiple filter types:
1. Text filter for product names
2. Dropdown filter for categories
3. Number range filter for sales amounts

## Backend Integration

When filters are applied, they send parameters to your backend API with the prefix `filter_`. For example:
- Text filter: `filter_name=John`
- Dropdown filter: `filter_category=A`
- Number range filter: `filter_amount_min=100&filter_amount_max=500`

Your backend should implement logic to filter data based on these parameters.

## Working with Drilldown

The filter functionality works seamlessly with the existing drilldown feature. Filters will be applied at each drilldown level, allowing users to filter data at any level of the drilldown hierarchy.

## Best Practices

1. **Limit the Number of Filters**: Too many filters can overwhelm users. Generally, 3-5 filters are sufficient for most use cases.

2. **Use Descriptive Labels**: Provide clear, user-friendly labels for filter fields.

3. **Match Field Names**: Ensure filter field names match the actual field names in your data source.

4. **Provide Meaningful Dropdown Options**: For dropdown filters, provide options that make sense for your data.

5. **Test with Real Data**: Always test filter configurations with actual data to ensure they work as expected.

## Troubleshooting

### Filters Not Working
- Check that field names match your data source
- Verify that your backend implements filter parameter handling
- Ensure the "Enable Filters" checkbox is checked

### Dropdown Options Not Displaying
- Check that options are comma-separated
- Verify there are no extra spaces around commas
- Ensure the filter type is set to "Dropdown"

### Range Filters Not Filtering
- Verify that the field contains numeric data
- Check that min and max values are entered correctly
- Ensure your backend handles range filter parameters

## Technical Details

### Data Structure
Filter configurations are stored as an array of objects in the chart configuration:

```json
{
  "enableFilters": true,
  "filterFields": [
    {
      "field": "category",
      "label": "Category",
      "type": "dropdown",
      "options": ["A", "B", "C"]
    },
    {
      "field": "name",
      "label": "Name",
      "type": "text"
    },
    {
      "field": "amount",
      "label": "Amount",
      "type": "number-range"
    }
  ]
}
```

### API Parameter Format
Filters are passed to the backend as query parameters:
- Text filter: `filter_[fieldname]=[value]`
- Dropdown filter: `filter_[fieldname]=[selected_value]`
- Number range filter: `filter_[fieldname]_min=[min_value]&filter_[fieldname]_max=[max_value]`

This configuration allows for flexible and powerful data filtering capabilities in your dashboard charts.