// Merges lines with only a grade as content with the previous line so the whole context gets colour coded
function mergeNodesWithParenthesisContent(arr) {
    for (let i = 0, merged = false; i < arr.length; i++) {
        if (merged) {
            merged = false;
            continue;
        }
        const current = arr[i];
        const next = arr[i + 1];

        if (next && /^\(\s*\d+\.\d+\s*betyg\s*\)$/.test(next)) {
            arr[i] = current + next;
            arr.splice(i + 1, 1);
            merged = true;
        }
    }

    return arr;
}

(function () {
    // Get all the paragraphs within the entry-excerpt div
    const paragraphs = document.querySelectorAll('.entry-excerpt');

    // Loop through each paragraph
    paragraphs.forEach(function (paragraph) {
        // Get the innerHTML of the paragraph and split it by line break
        let lines = paragraph.innerHTML.split('\n');
        lines = mergeNodesWithParenthesisContent(lines);

        // Create a new array to hold the new lines with span tags
        const newLines = [];

        // Loop through each line
        lines.forEach(function (line) {
            const match = line.match(/\(\s*(\d+\.\d+)\s*betyg\s*\)/);

            // If the line has content
            if (line.trim().length > 0 && match) {
                // Create a new span element
                const span = document.createElement('span');

                // Check the line value and set the appropriate style
                const value = match ? parseFloat(match[1]) : NaN;
                if (value >= 1 && value <= 2.99) {
                    span.style.color = 'red';
                } else if (value >= 3 && value <= 3.99) {
                    span.style.color = 'darkgoldenrod';
                }

                // Set the innerHTML of the span to the line
                span.innerHTML = line;

                // Replace the original line with the styled span in the new lines array
                newLines.push(span.outerHTML);
            } else {
                // If the line is empty, add it to the new lines array
                newLines.push(line);
            }
        });

        // Join the new lines and set the paragraph innerHTML
        paragraph.innerHTML = newLines.join('');
    });
})();
