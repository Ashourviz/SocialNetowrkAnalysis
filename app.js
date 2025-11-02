// Social Network Analysis Application
let networkData = null;
let network = null;
let allNodes = [];
let allEdges = [];
let filteredNodes = [];
let filteredEdges = [];
let physicsEnabled = true;

// Initialize the application
async function init() {
    try {
        // Load network data
        const response = await fetch('network_data.json');
        networkData = await response.json();

        // Prepare nodes and edges for vis.js
        prepareNetworkData();

        // Initialize network visualization
        initializeNetwork();

        // Setup UI elements
        setupFilters();
        updateStatistics();
        setupEventListeners();

        // Hide loading screen
        document.getElementById('loading').classList.add('hidden');
    } catch (error) {
        console.error('Error initializing application:', error);
        document.getElementById('loading').innerHTML = `
            <div class="loader"></div>
            <p>Error loading data. Please make sure network_data.json exists.</p>
        `;
    }
}

// Prepare network data for visualization
function prepareNetworkData() {
    // Transform nodes for vis.js
    allNodes = networkData.nodes.map(node => ({
        id: node.id,
        label: node.label,
        title: `${node.label}\nConnections: ${node.connections}`,
        value: Math.min(node.connections, 50), // Size based on connections (capped for visibility)
        connections: node.connections,
        platforms: node.platforms,
        sentiments: node.sentiments,
        color: getNodeColor(node),
        font: {
            color: '#f1f5f9',
            size: 14
        },
        borderWidth: 2,
        borderWidthSelected: 4
    }));

    // Transform edges for vis.js
    allEdges = networkData.edges.map((edge, index) => ({
        id: index,
        from: edge.from,
        to: edge.to,
        title: edge.description || '',
        platform: edge.platform,
        post_sentiment: edge.post_sentiment,
        comment_sentiment: edge.comment_sentiment,
        color: {
            color: getSentimentColor(edge.comment_sentiment, 0.2),
            highlight: getSentimentColor(edge.comment_sentiment, 0.6),
            hover: getSentimentColor(edge.comment_sentiment, 0.4)
        },
        width: 1,
        arrows: {
            to: {
                enabled: true,
                scaleFactor: 0.5
            }
        },
        smooth: {
            type: 'continuous'
        }
    }));

    filteredNodes = [...allNodes];
    filteredEdges = [...allEdges];
}

// Get node color based on dominant sentiment
function getNodeColor(node) {
    const sentiments = node.sentiments;
    const total = sentiments.positive + sentiments.negative + sentiments.neutral;

    if (total === 0) {
        return {
            background: '#6366f1',
            border: '#8b5cf6',
            highlight: {
                background: '#8b5cf6',
                border: '#a855f7'
            }
        };
    }

    const positiveRatio = sentiments.positive / total;
    const negativeRatio = sentiments.negative / total;

    if (positiveRatio > 0.5) {
        return {
            background: '#10b981',
            border: '#059669',
            highlight: {
                background: '#34d399',
                border: '#10b981'
            }
        };
    } else if (negativeRatio > 0.5) {
        return {
            background: '#ef4444',
            border: '#dc2626',
            highlight: {
                background: '#f87171',
                border: '#ef4444'
            }
        };
    } else {
        return {
            background: '#f59e0b',
            border: '#d97706',
            highlight: {
                background: '#fbbf24',
                border: '#f59e0b'
            }
        };
    }
}

// Get sentiment color
function getSentimentColor(sentiment, opacity = 1) {
    const sentimentLower = sentiment.toLowerCase();
    if (sentimentLower === 'positive') {
        return `rgba(16, 185, 129, ${opacity})`;
    } else if (sentimentLower === 'negative') {
        return `rgba(239, 68, 68, ${opacity})`;
    } else {
        return `rgba(245, 158, 11, ${opacity})`;
    }
}

// Initialize network visualization
function initializeNetwork() {
    const container = document.getElementById('network');

    const data = {
        nodes: new vis.DataSet(filteredNodes),
        edges: new vis.DataSet(filteredEdges)
    };

    const options = {
        nodes: {
            shape: 'dot',
            scaling: {
                min: 10,
                max: 40,
                label: {
                    enabled: true,
                    min: 12,
                    max: 20
                }
            },
            font: {
                size: 14,
                color: '#f1f5f9'
            }
        },
        edges: {
            width: 1,
            smooth: {
                type: 'continuous',
                roundness: 0.5
            }
        },
        physics: {
            enabled: true,
            stabilization: {
                enabled: true,
                iterations: 100,
                updateInterval: 25
            },
            barnesHut: {
                gravitationalConstant: -8000,
                centralGravity: 0.3,
                springLength: 150,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0.1
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 100,
            navigationButtons: false,
            zoomView: true,
            dragView: true
        },
        layout: {
            improvedLayout: true,
            randomSeed: 42
        }
    };

    network = new vis.Network(container, data, options);

    // Event listeners for network interactions
    network.on('selectNode', function (params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            showNodeInfo(nodeId);
        }
    });

    network.on('deselectNode', function () {
        hideNodeInfo();
    });

    network.on('stabilizationProgress', function (params) {
        const progress = Math.round((params.iterations / params.total) * 100);
        document.getElementById('loading').innerHTML = `
            <div class="loader"></div>
            <p>Stabilizing network... ${progress}%</p>
        `;
    });

    network.once('stabilizationIterationsDone', function () {
        network.setOptions({ physics: { enabled: physicsEnabled } });
    });
}

// Show node information
function showNodeInfo(nodeId) {
    const node = allNodes.find(n => n.id === nodeId);
    if (!node) return;

    const nodeInfoSection = document.getElementById('node-info-section');
    const nodeInfo = document.getElementById('node-info');

    const connectedEdges = allEdges.filter(e => e.from === nodeId || e.to === nodeId);
    const platformsStr = node.platforms.length > 0 ? node.platforms.join(', ') : 'N/A';

    nodeInfo.innerHTML = `
        <div class="node-info-item">
            <div class="node-info-label">Name</div>
            <div class="node-info-value">${node.label}</div>
        </div>
        <div class="node-info-item">
            <div class="node-info-label">Total Connections</div>
            <div class="node-info-value">${node.connections}</div>
        </div>
        <div class="node-info-item">
            <div class="node-info-label">Platforms</div>
            <div class="node-info-value">${platformsStr}</div>
        </div>
        <div class="node-info-item">
            <div class="node-info-label">Sentiment Distribution</div>
            <div class="node-info-value">
                <span class="positive">Positive: ${node.sentiments.positive}</span><br>
                <span class="negative">Negative: ${node.sentiments.negative}</span><br>
                <span class="neutral">Neutral: ${node.sentiments.neutral}</span>
            </div>
        </div>
    `;

    nodeInfoSection.style.display = 'block';
}

// Hide node information
function hideNodeInfo() {
    document.getElementById('node-info-section').style.display = 'none';
}

// Setup filters
function setupFilters() {
    // Populate platform filter
    const platformFilter = document.getElementById('platform-filter');
    const platforms = networkData.stats.platforms;
    platforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = platform;
        option.textContent = platform;
        platformFilter.appendChild(option);
    });

    // Update min connections range max value
    const maxConnections = Math.max(...allNodes.map(n => n.connections));
    const minConnectionsInput = document.getElementById('min-connections');
    minConnectionsInput.max = Math.min(maxConnections, 100);
}

// Setup event listeners
function setupEventListeners() {
    // Filter changes
    document.getElementById('platform-filter').addEventListener('change', applyFilters);
    document.getElementById('sentiment-filter').addEventListener('change', applyFilters);
    document.getElementById('search-node').addEventListener('input', applyFilters);
    document.getElementById('min-connections').addEventListener('input', function (e) {
        document.getElementById('min-connections-value').textContent = e.target.value;
        applyFilters();
    });

    // Reset filters
    document.getElementById('reset-filters').addEventListener('click', resetFilters);

    // Control buttons
    document.getElementById('zoom-in').addEventListener('click', () => {
        network.moveTo({ scale: network.getScale() * 1.2 });
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        network.moveTo({ scale: network.getScale() * 0.8 });
    });

    document.getElementById('fit-network').addEventListener('click', () => {
        network.fit({ animation: true });
    });

    document.getElementById('toggle-physics').addEventListener('click', function () {
        physicsEnabled = !physicsEnabled;
        network.setOptions({ physics: { enabled: physicsEnabled } });
        this.classList.toggle('active');
    });
}

// Apply filters
function applyFilters() {
    const platform = document.getElementById('platform-filter').value;
    const sentiment = document.getElementById('sentiment-filter').value;
    const searchTerm = document.getElementById('search-node').value.toLowerCase();
    const minConnections = parseInt(document.getElementById('min-connections').value);

    // Filter edges
    filteredEdges = allEdges.filter(edge => {
        if (platform !== 'all' && edge.platform !== platform) return false;
        if (sentiment !== 'all' && edge.comment_sentiment.toLowerCase() !== sentiment) return false;
        return true;
    });

    // Get nodes that are connected by filtered edges
    const connectedNodeIds = new Set();
    filteredEdges.forEach(edge => {
        connectedNodeIds.add(edge.from);
        connectedNodeIds.add(edge.to);
    });

    // Filter nodes
    filteredNodes = allNodes.filter(node => {
        if (!connectedNodeIds.has(node.id)) return false;
        if (node.connections < minConnections) return false;
        if (searchTerm && !node.label.toLowerCase().includes(searchTerm)) return false;
        return true;
    });

    // Update network
    updateNetwork();
    updateStatistics();
}

// Reset filters
function resetFilters() {
    document.getElementById('platform-filter').value = 'all';
    document.getElementById('sentiment-filter').value = 'all';
    document.getElementById('search-node').value = '';
    document.getElementById('min-connections').value = '1';
    document.getElementById('min-connections-value').textContent = '1';

    filteredNodes = [...allNodes];
    filteredEdges = [...allEdges];

    updateNetwork();
    updateStatistics();
}

// Update network visualization
function updateNetwork() {
    const nodes = network.body.data.nodes;
    const edges = network.body.data.edges;

    nodes.clear();
    edges.clear();

    nodes.add(filteredNodes);
    edges.add(filteredEdges);

    network.fit({ animation: true });
}

// Update statistics
function updateStatistics() {
    // Update header stats
    document.getElementById('total-nodes').textContent = filteredNodes.length;
    document.getElementById('total-edges').textContent = filteredEdges.length;

    // Calculate sentiment distribution for filtered edges
    const sentimentCounts = {
        positive: 0,
        negative: 0,
        neutral: 0
    };

    filteredEdges.forEach(edge => {
        const sentiment = edge.comment_sentiment.toLowerCase();
        if (sentiment in sentimentCounts) {
            sentimentCounts[sentiment]++;
        }
    });

    const total = sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral;

    // Update sentiment bars
    if (total > 0) {
        const positivePercent = (sentimentCounts.positive / total) * 100;
        const negativePercent = (sentimentCounts.negative / total) * 100;
        const neutralPercent = (sentimentCounts.neutral / total) * 100;

        document.getElementById('positive-bar').style.width = `${positivePercent}%`;
        document.getElementById('negative-bar').style.width = `${negativePercent}%`;
        document.getElementById('neutral-bar').style.width = `${neutralPercent}%`;

        document.getElementById('positive-value').textContent = sentimentCounts.positive;
        document.getElementById('negative-value').textContent = sentimentCounts.negative;
        document.getElementById('neutral-value').textContent = sentimentCounts.neutral;
    }

    // Update platform list
    const platformCounts = {};
    filteredEdges.forEach(edge => {
        if (edge.platform) {
            platformCounts[edge.platform] = (platformCounts[edge.platform] || 0) + 1;
        }
    });

    const platformList = document.getElementById('platform-list');
    platformList.innerHTML = '';

    Object.entries(platformCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([platform, count]) => {
            const item = document.createElement('div');
            item.className = 'platform-item';
            item.innerHTML = `
                <span class="platform-name">${platform}</span>
                <span class="platform-count">${count}</span>
            `;
            platformList.appendChild(item);
        });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
