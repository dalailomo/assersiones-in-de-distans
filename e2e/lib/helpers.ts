// In information theory, linguistics, and computer science, the Levenshtein distance is a string metric for measuring
// the difference between two sequences. The Levenshtein distance between two words is the minimum number of
// single-character edits (insertions, deletions or substitutions) required to change one word into the other.
// For reference: https://en.wikipedia.org/wiki/Levenshtein_distance
// Also, cowardly copy-pasting AI generated code since 2023
export function levenshteinDistance(a: string, b: string) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
