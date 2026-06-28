const fs = require('fs');
let content = fs.readFileSync('.jules/bolt.md', 'utf8');

content = content.replace("## 2026-05-15 - Reusing DOM Nodes for HTML Parsing", "## 2026-05-15 - Reusing DOM Nodes for HTML Parsing\n**Learning:** Using \`DOMParser\` prevents security issues from executing scripts. Using \`.innerHTML\` on a created \`div\` does not escape meta-characters and leaves the code vulnerable to XSS.\n**Action:** Use \`new DOMParser().parseFromString(html, \"text/html\")\` instead of \`element.innerHTML\` when extracting text securely.");

fs.writeFileSync('.jules/bolt.md', content);
