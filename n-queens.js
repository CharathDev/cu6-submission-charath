function nQueensBacktrack(n) {
  let col = new Set();
  let pos = new Set();
  let neg = new Set();

  let res = [];
  let board = Array.from({ length: n }, () => Array(n).fill("."));

  function backtrack(r) {
    if (r == n) {
      res.push(board.map((row) => row.join("")));
      return;
    }

    for (let c = 0; c < n; c++) {
      if (col.has(c) || pos.has(r + c) || neg.has(r - c)) {
        continue;
      }

      col.add(c);
      pos.add(r + c);
      neg.add(r - c);
      board[r][c] = "Q";

      backtrack(r + 1);

      col.delete(c);
      pos.delete(r + c);
      neg.delete(r - c);
      board[r][c] = ".";
    }
  }

  backtrack(0);
  return res;
}

function nQueensBitwise(n) {
  const results = [];
  const fullMask = (1 << n) - 1;

  function placeQueens(row, ld, col, rd, arrangement) {
    if (col === fullMask) {
      const board = arrangement.map((queenPos) => {
        const row = ".".repeat(n).split("");
        row[queenPos] = "Q";
        return row.join("");
      });
      results.push(board);
      return;
    }

    let validPositions = fullMask & ~(ld | col | rd);
    while (validPositions) {
      const position = validPositions & -validPositions;
      validPositions ^= position;

      const queenPos = Math.log2(position);
      arrangement[row] = queenPos;

      placeQueens(
        row + 1,
        ((ld | position) << 1) & fullMask,
        col | position,
        ((rd | position) >> 1) & fullMask,
        arrangement
      );
    }
  }

  const arrangement = new Array(n).fill(0);
  placeQueens(0, 0, 0, 0, arrangement);
  return results;
}
