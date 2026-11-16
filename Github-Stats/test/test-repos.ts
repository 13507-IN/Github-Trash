async function getStats() {
  const username = '13507-IN';
  let page = 1;
  const repos: any[] = [];
  while (true) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    repos.push(...data);
    page++;
  }

  let totalStars = 0;
  let totalForks = 0;
  const langBytes: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.fork) continue;
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;
    if (repo.language) {
      langBytes[repo.language] = (langBytes[repo.language] || 0) + (repo.size || 1);
    }
  }

  console.log('Repos count:', repos.length);
  console.log('Total Stars:', totalStars);
  console.log('Total Forks:', totalForks);
  console.log('Languages by repo count/size:', langBytes);
}

getStats().catch(console.error);
