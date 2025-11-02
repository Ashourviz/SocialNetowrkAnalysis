import pandas as pd
import json
from collections import defaultdict

# Read the Excel file
df = pd.read_excel('Kumu_Network_Output.xlsx', sheet_name='Connections')

# Create nodes and edges for the network visualization
nodes_dict = {}
edges = []

# Process each connection
for idx, row in df.iterrows():
    from_node = str(row['From'])
    to_node = str(row['To'])

    # Add nodes
    if from_node not in nodes_dict:
        nodes_dict[from_node] = {
            'id': from_node,
            'label': from_node,
            'connections': 0,
            'platforms': set(),
            'sentiments': {'positive': 0, 'negative': 0, 'neutral': 0}
        }

    if to_node not in nodes_dict:
        nodes_dict[to_node] = {
            'id': to_node,
            'label': to_node,
            'connections': 0,
            'platforms': set(),
            'sentiments': {'positive': 0, 'negative': 0, 'neutral': 0}
        }

    # Update node statistics
    nodes_dict[from_node]['connections'] += 1
    nodes_dict[to_node]['connections'] += 1

    if pd.notna(row['Platform']):
        platform = str(row['Platform'])
        nodes_dict[from_node]['platforms'].add(platform)
        nodes_dict[to_node]['platforms'].add(platform)

    # Update sentiment counts
    sentiment = str(row['Comment_Sentiment']).lower() if pd.notna(row['Comment_Sentiment']) else 'neutral'
    if sentiment in nodes_dict[to_node]['sentiments']:
        nodes_dict[to_node]['sentiments'][sentiment] += 1

    # Create edge
    edge = {
        'from': from_node,
        'to': to_node,
        'description': str(row['Description']) if pd.notna(row['Description']) else '',
        'post_link': str(row['post_link']) if pd.notna(row['post_link']) else '',
        'platform': str(row['Platform']) if pd.notna(row['Platform']) else '',
        'post_sentiment': str(row['Post_Sentiment']) if pd.notna(row['Post_Sentiment']) else '',
        'comment_sentiment': str(row['Comment_Sentiment']) if pd.notna(row['Comment_Sentiment']) else '',
        'comment_index': int(row['Comment_Index']) if pd.notna(row['Comment_Index']) else 0
    }
    edges.append(edge)

# Convert nodes to list and handle sets
nodes = []
for node_id, node_data in nodes_dict.items():
    node_data['platforms'] = list(node_data['platforms'])
    nodes.append(node_data)

# Calculate statistics
stats = {
    'total_nodes': len(nodes),
    'total_edges': len(edges),
    'platforms': list(set(edge['platform'] for edge in edges if edge['platform'])),
    'sentiment_distribution': {
        'positive': sum(1 for edge in edges if edge['comment_sentiment'].lower() == 'positive'),
        'negative': sum(1 for edge in edges if edge['comment_sentiment'].lower() == 'negative'),
        'neutral': sum(1 for edge in edges if edge['comment_sentiment'].lower() == 'neutral')
    }
}

# Create the final data structure
network_data = {
    'nodes': nodes,
    'edges': edges,
    'stats': stats
}

# Save to JSON file
with open('network_data.json', 'w', encoding='utf-8') as f:
    json.dump(network_data, f, ensure_ascii=False, indent=2)

print(f"Data conversion complete!")
print(f"Total Nodes: {stats['total_nodes']}")
print(f"Total Edges: {stats['total_edges']}")
print(f"Platforms: {', '.join(stats['platforms'])}")
print(f"Sentiment Distribution: Positive={stats['sentiment_distribution']['positive']}, Negative={stats['sentiment_distribution']['negative']}, Neutral={stats['sentiment_distribution']['neutral']}")
