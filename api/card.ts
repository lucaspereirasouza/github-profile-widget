import { VercelRequest, VercelResponse } from '@vercel.node';

const API_HOST = 'https://api.github.com';

const fetchGitHub = async (url: string) => {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'github-profile-widget',
            // If we had a GH_TOKEN, we'd add it here:
            // 'Authorization': `Bearer ${process.env.GH_TOKEN}`
        },
    });
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    return response.json();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { username, theme = 'light' } = req.query;

    if (!username || typeof username !== 'string') {
        return res.status(400).send('Username is required');
    }

    try {
        const profile = await fetchGitHub(`${API_HOST}/users/${username}`);
        const repos = await fetchGitHub(profile.repos_url);

        // Aggregate languages from the repos (using the 'language' field for efficiency)
        const languagesMap: Record<string, number> = {};
        repos.forEach((repo: any) => {
            if (repo.language) {
                languagesMap[repo.language] = (languagesMap[repo.language] || 0) + 1;
            }
        });

        const topLanguages = Object.entries(languagesMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang]) => lang);

        // Sort and slice repos
        const sortedRepos = repos
            .sort((a: any, b: any) => {
                if (b.stargazers_count !== a.stargazers_count) {
                    return b.stargazers_count - a.stargazers_count;
                }
                const dateA = new Date(a.updated_at).getTime();
                const dateB = new Date(b.updated_at).getTime();
                return dateB - dateA;
            })
            .slice(0, 5);

        const isBlack = theme === 'black';
        const bgColor = isBlack ? '#161b22' : '#ffffff';
        const textColor = isBlack ? '#c9d1d9' : '#24292f';
        const borderColor = isBlack ? '#30363d' : '#d0d7de';
        const starColor = isBlack ? '#8b949e' : '#57606a';
        const nameColor = isBlack ? '#58a6ff' : '#0969da';
        const headerBg = isBlack ? '#21262d' : '#f6f8fa';

        const svg = `
<svg width="380" height="420" viewBox="0 0 380 420" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="379" height="419" rx="8" fill="${bgColor}" stroke="${borderColor}"/>
  
  <!-- Profile Header -->
  <defs>
    <clipPath id="avatarClip">
      <rect x="15" y="15" width="80" height="80" rx="8" />
    </clipPath>
  </defs>
  <image x="15" y="15" width="80" height="80" href="${profile.avatar_url}" clip-path="url(#avatarClip)"/>
  
  <text x="110" y="40" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="22" font-weight="600" fill="${textColor}">${profile.name || profile.login}</text>
  
  <text x="110" y="65" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="${starColor}">${profile.followers} followers</text>

  <!-- Languages -->
  <line x1="15" y1="115" x2="365" y2="115" stroke="${borderColor}"/>
  <text x="15" y="110" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" font-style="italic" fill="${textColor}">Top languages</text>
  <text x="15" y="135" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" font-weight="600" fill="${textColor}">${topLanguages.join('  •  ')}</text>

  <!-- Repositories Header -->
  <rect x="1" y="150" width="378" height="35" fill="${headerBg}" stroke="${borderColor}"/>
  <text x="15" y="173" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" font-weight="600" fill="${textColor}">Repositories</text>

  <!-- Repository List -->
  ${sortedRepos.map((repo: any, i: number) => `
  <g transform="translate(15, ${200 + i * 45})">
    <text x="0" y="12" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="15" font-weight="600" fill="${textColor}">${repo.name}</text>
    <text x="0" y="30" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" font-style="italic" fill="${starColor}">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</text>
    <text x="350" y="22" text-anchor="end" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="${starColor}">${repo.stargazers_count} ★</text>
    ${i < sortedRepos.length - 1 ? `<line x1="-15" y1="40" x2="350" y2="40" stroke="${borderColor}"/>` : ''}
  </g>
  `).join('')}
</svg>
    `;

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(svg);
    } catch (error: any) {
        res.status(500).send(`Error generating card: ${error.message}`);
    }
}
