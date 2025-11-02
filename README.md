# Social Network Analysis Visualization

A modern, interactive web application for visualizing and analyzing social network data from the Kumu Network Output Excel file.

## Features

### Interactive Network Visualization
- **Dynamic Network Graph**: Interactive visualization of 15,931 nodes and 16,090 connections
- **Physics Simulation**: Toggle-able physics engine for natural network layout
- **Zoom & Pan**: Navigate through the network with smooth zoom and pan controls
- **Node Selection**: Click on any node to view detailed information

### Advanced Filtering
- **Platform Filter**: Filter connections by social media platform (Google, LinkedIn, YouTube, TikTok, Twitter)
- **Sentiment Filter**: Filter by sentiment analysis (Positive, Negative, Neutral)
- **Search**: Find specific nodes by name
- **Connection Threshold**: Filter nodes by minimum number of connections

### Analytics Dashboard
- **Real-time Statistics**: View total nodes and connections count
- **Sentiment Distribution**: Visual representation of positive, negative, and neutral sentiments
- **Platform Distribution**: See the breakdown of connections across different platforms
- **Node Details**: Detailed information for selected nodes including:
  - Total connections
  - Active platforms
  - Sentiment breakdown

### Modern UI/UX
- **Dark Theme**: Easy on the eyes with a contemporary dark color scheme
- **Glass Morphism**: Modern frosted glass effects
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Polished transitions and interactions
- **Gradient Accents**: Beautiful color gradients throughout

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: vis.js Network library
- **Data Processing**: Python with pandas and openpyxl
- **Icons**: Font Awesome 6

## Files Structure

```
SocialNetowrkAnalysis/
├── index.html              # Main HTML structure
├── style.css               # Modern CSS styling
├── app.js                  # JavaScript application logic
├── convert_data.py         # Python script to convert Excel to JSON
├── Kumu_Network_Output.xlsx # Source data
├── network_data.json       # Processed network data
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Python 3.x with pandas and openpyxl libraries
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Local web server (optional, for local testing)

### Installation

1. **Convert Excel Data to JSON**
   ```bash
   python3 convert_data.py
   ```
   This will generate `network_data.json` from the Excel file.

2. **Open the Application**
   - Option 1: Open `index.html` directly in your browser
   - Option 2: Use a local web server:
     ```bash
     python3 -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`

## Usage

### Navigation Controls
- **Zoom In/Out**: Use the zoom buttons or scroll wheel
- **Pan**: Click and drag to move around the network
- **Fit Network**: Click the expand button to fit all visible nodes
- **Toggle Physics**: Enable/disable the physics simulation

### Filtering Data
1. **By Platform**: Select a platform from the dropdown to show only connections from that platform
2. **By Sentiment**: Filter connections based on sentiment analysis
3. **Search**: Type a node name to find specific users
4. **Min Connections**: Adjust the slider to show only nodes with a minimum number of connections

### Viewing Node Details
- Click on any node to view detailed information in the sidebar
- Click on empty space to deselect

### Resetting Filters
- Click the "Reset Filters" button to clear all filters and view the full network

## Data Overview

- **Total Nodes**: 15,931 unique users/entities
- **Total Connections**: 16,090 interactions
- **Platforms**: Google, LinkedIn, YouTube, TikTok, Twitter
- **Sentiment Distribution**:
  - Positive: 10,242 (63.7%)
  - Negative: 3,487 (21.7%)
  - Neutral: 2,361 (14.7%)

## Color Coding

### Nodes
- **Green**: Predominantly positive sentiment
- **Red**: Predominantly negative sentiment
- **Orange**: Mixed or neutral sentiment
- **Blue**: No sentiment data
- **Size**: Proportional to number of connections

### Edges
- **Green**: Positive sentiment connection
- **Red**: Negative sentiment connection
- **Orange**: Neutral sentiment connection
- **Opacity**: Lighter for normal state, darker when highlighted

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Notes

- The application uses vis.js physics simulation which may be CPU-intensive for large networks
- Toggle off physics after initial layout for better performance
- Filtering reduces the number of visible nodes/edges for improved performance
- Consider using a modern computer with adequate RAM for optimal experience

## Future Enhancements

- Export network data and visualizations
- Advanced analytics (centrality measures, community detection)
- Timeline view for temporal analysis
- Custom color schemes
- Save/load filter presets

## License

This project is created for data visualization and analysis purposes.

## Credits

Developed using modern web technologies and best practices in data visualization.
