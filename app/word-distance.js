const levenshteinDistance = (s, t) => {
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
};

// threshold for being close is fixed for word with length 1 to 10:
const threshold = {
  2: 1,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 2,
  8: 3,
  9: 3,
  10: 3,
};

const isWordClose = (guess, target) => {
  const dist = levenshteinDistance(guess, target);

  if (guess.length <= 10) {
    return dist <= threshold[guess.length];
  }

  // calculates the % of the distance according to the guess word size
  const percentDist = dist / guess;

  return percentDist <= 0.3;
};

export default isWordClose;
