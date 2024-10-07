function getSkylineSweepLine(buildings) {
  const points = [];

  // Step 1: Convert buildings into start and end points
  for (const [left, right, height] of buildings) {
    points.push([left, -height]); // Negative height indicates start of building
    points.push([right, height]); // Positive height indicates end of building
  }

  // Step 2: Sort points by x-coordinate
  points.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return b[1] - a[1]; // If x is same, process higher height first
  });

  const result = [];
  const heights = [0]; // Max heap to track current heights
  let prevHeight = 0;

  // Step 3: Process points
  for (const [x, h] of points) {
    if (h < 0) {
      heights.push(-h); // Add height for start point
    } else {
      const index = heights.indexOf(h);
      heights.splice(index, 1); // Remove height for end point
    }

    const currentHeight = Math.max(...heights);

    // Step 4: Add to result if height changes
    if (currentHeight !== prevHeight) {
      result.push([x, currentHeight]);
      prevHeight = currentHeight;
    }
  }

  return result;
}

function getSkylineDivideConquer(buildings) {
  if (buildings.length === 0) return [];

  function mergeSkylines(left, right) {
    const merged = [];
    let h1 = 0,
      h2 = 0;
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      let x, h;

      if (left[i][0] < right[j][0]) {
        [x, h1] = left[i];
        i++;
      } else if (left[i][0] > right[j][0]) {
        [x, h2] = right[j];
        j++;
      } else {
        x = left[i][0];
        h1 = left[i][1];
        h2 = right[j][1];
        i++;
        j++;
      }

      h = Math.max(h1, h2);
      if (merged.length === 0 || merged[merged.length - 1][1] !== h) {
        merged.push([x, h]);
      }
    }

    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);

    return merged;
  }

  function divideAndConquer(start, end) {
    if (start === end) {
      const [left, right, height] = buildings[start];
      return [
        [left, height],
        [right, 0],
      ];
    }

    const mid = Math.floor((start + end) / 2);
    const leftSkyline = divideAndConquer(start, mid);
    const rightSkyline = divideAndConquer(mid + 1, end);

    return mergeSkylines(leftSkyline, rightSkyline);
  }

  return divideAndConquer(0, buildings.length - 1);
}
