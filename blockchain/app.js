const params = new URLSearchParams(window.location.search);
const latency = Number(params.get('latency') ?? 100);
const nodeslength = Number(params.get('nodes') ?? 200);
const degree = Number(params.get('degree') ?? 5);
const tickSpeed = Number(params.get('tickSpeed') ?? 3000);

const { nodes, links } = generateRandomNetwork(nodeslength, degree, (node) => {
    const power = Math.pow(Math.random(), 2) / tickSpeed;
    return { id: node, power, blocks: [0] };
}, (a, b) => ({ latency }));
let t = 0;
let selectedNode = null;
let pause = false;

loadGraph(document.getElementById("graph"), nodes, links, simulation);

function update(svg) {
    for (const node of nodes) {
        if (Math.random() <= node.power) {
            const block = Math.floor(Math.random() * 100);
            node.blocks.push(block);
            propagate(svg, node);
        }
    }
    paint(svg);
}

function propagate(svg, node, visited = new Set()) {
    if (visited.has(node.id)) return;
    visited.add(node.id);
    
    const snapshot = [...node.blocks];
    const snapshotLength = snapshot.length;
    
    setTimeout(() => {
        if (pause) {
            setTimeout(() => {
                visited.delete(node.id);
                propagate(svg, node, visited);
            }, 100);
            return;
        }
        for (const link of links) {
            let target = null;
            if (link.source.id === node.id) target = link.target;
            if (link.target.id === node.id) target = link.source;
            if (!target || visited.has(target.id)) continue;
            if (snapshotLength > target.blocks.length) {
                target.blocks = [...snapshot];
                paint(svg);
                propagate(svg, target, visited);
            }
        }
    }, latency);
}

function paint(svg) {
    const reference = getMajorityChain(); 

    svg.selectAll("circle")
        .data(nodes)
        .attr("fill", (d) => {
            const common = getCommonPrefix(reference, d.blocks);
            const less = reference.length - common.length;
            const more = d.blocks.length - common.length;
            if (less > 0 && more > 0) {
                return "#EF4444";
            }
            if (less > 0) {
                return "#3B82F6";
            }
            return "#F59E0B";
        });

    svg.selectAll("text")
        .data(nodes)
        .text(d => {
            const common = getCommonPrefix(d.blocks, reference);
            const less = reference.length - common.length;
            const more = d.blocks.length - common.length;
            return "";
            if (less === 0 && more === 0) return "";
            if (less === 0) return `+${more}`;
            if (more === 0) return `-${less}`;
            return `-${less}/+${more}`;
        });

    document.getElementById("tickCount").innerText = (t / 10).toFixed(1) + "s";
    document.getElementById("nodeCount").innerText = nodes.length;
    document.getElementById("degreeCount").innerText = degree;
    document.getElementById("latencyValue").innerText = latency + " ms";
    document.getElementById("height").innerText = getMajorityChain().length;

    document.getElementById("major-chain").innerText = reference.slice(-100).join(" → ");
    if (selectedNode) {
        document.getElementById("node-chain").innerText = selectedNode.blocks.slice(-100).join(" → ");
    } else {
        document.getElementById("node-chain").textContent = "(hover a node)";
    }
    
    const alignedCount = nodes.filter(n => {
        const common = getCommonPrefix(reference, n.blocks);
        return common.length === reference.length;
    }).length;
    const alignedPercentage = ((alignedCount / nodes.length) * 100).toFixed(2) + "%";
    document.getElementById("alignedPercentage").innerText = alignedPercentage;
}

function simulation(svg) {
    return setInterval(() => {
        t += 1;
        update(svg);
    }, 100);
}

function getMajorityChain() {
    let majority = [];
    for (const node of nodes) {
        if (node.blocks.length > majority.length) {
            majority = node.blocks;
        }
    }
    return majority;
}

function getCommonPrefix(l1, l2) {
    let i = 0;
    while (i < l1.length && i < l2.length && l1[i] === l2[i]) {
        i++;
    }
    return l1.slice(0, i);
}

function loadGraph(element, nodes, links, simulationFn) {
    const { width, height } = element.getBoundingClientRect();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).distance(Math.sqrt(width * height / nodes.length)))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(element).append("svg")
        .attr("width", width)
        .attr("height", height);

    const observer = new ResizeObserver(() => {
        const { width, height } = element.getBoundingClientRect();
        svg.attr("width", width).attr("height", height);
        simulation.force("center", d3.forceCenter(width / 2, height / 2));
        simulation.alpha(1).restart();
    });
    observer.observe(element);

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", 2)
        .attr("stroke", "#999");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", d => Math.max(Math.sqrt(d.power * tickSpeed) * 35, 1))
        .attr("fill", "#F59E0B")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseenter", (event, d) => {
            selectedNode = d;
            document.getElementById("node-chain").innerText = selectedNode.blocks.slice(-100).join(" → ");
        })
        .on("mouseleave", () => {
            selectedNode = null;
            document.getElementById("node-chain").textContent = "(hover a node)";
        });

    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text("")
        .attr("font-size", 24)
        .attr("fill", "#333")
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .on("mouseenter", (event, d) => {
            selectedNode = d;
            document.getElementById("node-chain").innerText = selectedNode.blocks.slice(-100).join(" → ");
        })
        .on("mouseleave", () => {
            selectedNode = null;
            document.getElementById("node-chain").textContent = "(hover a node)";
        });

    node.append("title")
        .text(d => `node ${d.id}`);

    simulation
        .nodes(nodes)
        .force("collision", d3.forceCollide().radius(35))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("y", d3.forceY(height / 2).strength(0.1))
        .on("tick", ticked);

    simulation.force("link")
        .links(links);


    let sim = null;
    simulation.on("end", () => {
        if (simulationFn) sim = simulationFn(svg);
    });

    window.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            if (sim) {
                clearInterval(sim);
                sim = null;
                pause = true;
            } else {
                if (simulationFn) {
                    sim = simulationFn(svg);
                    pause = false;
                }
            }
        }
    });

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function generateRandomNetwork(nodeCount, degree, node, link) {
    if ((nodeCount * degree) % 2 !== 0) {
        throw new Error("nodeCount * degree must be even");
    }
    if (degree >= nodeCount) {
        throw new Error("degree must be < nodeCount");
    }

    const nodes = Array.from({ length: nodeCount }, (_, i) => node(i));
    const adj = Array.from({ length: nodeCount }, () => new Set());

    // step 1: stubs
    const stubs = [];
    for (let i = 0; i < nodeCount; i++) {
        for (let k = 0; k < degree; k++) {
            stubs.push(i);
        }
    }

    // shuffle
    for (let i = stubs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [stubs[i], stubs[j]] = [stubs[j], stubs[i]];
    }

    const links = [];

    // pairing
    for (let i = 0; i < stubs.length; i += 2) {
        const a = stubs[i];
        const b = stubs[i + 1];

        // evita self-loop e multi-edge
        if (a === b || adj[a].has(b)) {
            // fallback semplice: rigenera
            return generateRandomNetwork(nodeCount, degree, node, link);
        }

        adj[a].add(b);
        adj[b].add(a);

        links.push({ source: a, target: b, ...link?.(a, b) });
    }

    // check connettività
    const visited = new Set();
    (function dfs(n) {
        visited.add(n);
        for (const m of adj[n]) {
            if (!visited.has(m)) dfs(m);
        }
    })(0);

    if (visited.size !== nodeCount) {
        return generateRandomNetwork(nodeCount, degree, node, link);
    }

    return { nodes, links };
}
