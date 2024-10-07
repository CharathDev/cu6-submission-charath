function isRectangleCoverLineSweep(rectangles) {
  const events = [];
  const active = new Map();

  // For each rectangle, add two events: one for entering and one for exiting
  for (const [x1, y1, x2, y2] of rectangles) {
    events.push({ x: x1, y1, y2, type: "enter" });
    events.push({ x: x2, y1, y2, type: "exit" });
  }

  // Sort events: first by x, then enter events before exit events
  events.sort((a, b) => a.x - b.x || (a.type === "enter" ? -1 : 1));

  // Sweep through events
  for (const event of events) {
    if (event.type === "enter") {
      // Check for overlaps with active intervals
      for (const [y1, y2] of active.values()) {
        if (!(event.y2 <= y1 || event.y1 >= y2)) return false;
      }
      active.set(`${event.y1},${event.y2}`, [event.y1, event.y2]);
    } else {
      // Remove exiting intervals
      active.delete(`${event.y1},${event.y2}`);
    }
  }

  // If the active set is empty, no overlaps, so the rectangles form a perfect rectangle
  return true;
}

function isRectangleCoverCornerCounting(rectangles) {
  const corners = new Set();
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let totalArea = 0;

  for (const [x1, y1, x2, y2] of rectangles) {
    // Calculate the total area of all rectangles
    totalArea += (x2 - x1) * (y2 - y1);

    // Update the bounding box of the large rectangle
    minX = Math.min(minX, x1);
    minY = Math.min(minY, y1);
    maxX = Math.max(maxX, x2);
    maxY = Math.max(maxY, y2);

    // Track corners using a set
    const cornerPoints = [
      [x1, y1],
      [x1, y2],
      [x2, y1],
      [x2, y2],
    ];
    for (const [x, y] of cornerPoints) {
      const key = `${x},${y}`;
      if (corners.has(key)) {
        corners.delete(key); // Remove if already exists
      } else {
        corners.add(key); // Add if new
      }
    }
  }

  // Check the area of the bounding rectangle
  const boundingArea = (maxX - minX) * (maxY - minY);
  if (totalArea !== boundingArea) return false;

  // Check if only the four bounding corners remain
  const expectedCorners = [
    `${minX},${minY}`,
    `${minX},${maxY}`,
    `${maxX},${minY}`,
    `${maxX},${maxY}`,
  ];

  if (corners.size !== 4) return false;
  for (const corner of expectedCorners) {
    if (!corners.has(corner)) return false;
  }

  return true;
}
