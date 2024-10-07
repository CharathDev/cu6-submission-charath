let bruteForce = (words) => {
  let res = [];

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i != j) {
        let temp = words[i] + words[j];
        if (temp == temp.split("").reverse().join("")) res.push([i, j]);
      }
    }
  }

  return res;
};

function palindromePairsHashMap(words) {
  const wordMap = new Map();
  const result = [];

  // Step 1: Build word map for O(1) lookup
  words.forEach((word, index) => {
    wordMap.set(word, index);
  });

  // Step 2: Check each word
  words.forEach((word, i) => {
    // Step 3: Try all possible splits of the current word
    for (let j = 0; j <= word.length; j++) {
      const prefix = word.slice(0, j);
      const suffix = word.slice(j);

      // Case 1: If suffix is palindrome, find reverse of prefix
      if (isPalindrome(suffix)) {
        const reversePrefix = prefix.split("").reverse().join("");
        if (wordMap.has(reversePrefix) && wordMap.get(reversePrefix) !== i) {
          result.push([i, wordMap.get(reversePrefix)]);
        }
      }

      // Case 2: If prefix is palindrome and j > 0, find reverse of suffix
      if (j > 0 && isPalindrome(prefix)) {
        const reverseSuffix = suffix.split("").reverse().join("");
        if (wordMap.has(reverseSuffix) && wordMap.get(reverseSuffix) !== i) {
          result.push([wordMap.get(reverseSuffix), i]);
        }
      }
    }
  });

  return result;
}

function isPalindrome(s) {
  let left = 0,
    right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(palindromePairsHashMap(["lls", "s", "cat"]));
