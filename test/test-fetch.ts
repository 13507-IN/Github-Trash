async function test() {
  const res = await fetch('https://github.com/users/13507-IN/contributions');
  const html = await res.text();

  // Pattern 1: data-date="YYYY-MM-DD" ... id="contribution-day-component-..."
  // Pattern 2: Tooltip: "No contributions on..." or "X contributions on..."
  const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]+)"/g;
  const days: { date: string; id: string; count: number }[] = [];
  let match;
  while ((match = dayRegex.exec(html)) !== null) {
    days.push({ date: match[1], id: match[2], count: 0 });
  }

  // Parse tooltips
  const tooltipRegex = /<tool-tip[^>]*for="(contribution-day-component-[^"]+)"[^>]*>(.*?)<\/tool-tip>/gs;
  const counts = new Map<string, number>();
  let ttMatch;
  while ((ttMatch = tooltipRegex.exec(html)) !== null) {
    const id = ttMatch[1];
    const text = ttMatch[2].replace(/\s+/g, ' ').trim();
    // e.g. "No contributions on November 10, 2024" or "5 contributions on November 11, 2024"
    let count = 0;
    const numMatch = text.match(/^(\d+)\s+contribution/);
    if (numMatch) {
      count = parseInt(numMatch[1], 10);
    }
    counts.set(id, count);
  }

  for (const d of days) {
    d.count = counts.get(d.id) ?? 0;
  }

  console.log(`Found ${days.length} days.`);
  console.log('Last 15 days of 13507-IN:');
  for (const d of days.slice(-15)) {
    console.log(`  Date: ${d.date} | Count: ${d.count}`);
  }
}

test().catch(console.error);
