# GitHub Profile Card

> Widget shows your GitHub profile directly on your website or GitHub README.
> Show your current projects — always up to date.

![Screenshot](./demo/screenshot.png)

## Contents

- [🚀 Use in your GitHub Profile README](#use-in-your-github-profile-readme)
- [Live demo and configuration](#live-demo-and-configuration)
- [Quick install (for websites)](#quick-install-for-websites)
- [FAQ](#faq)

---

### 🚀 Use in your GitHub Profile README

To add this widget to your GitHub Profile, you should use it as a **Link**. GitHub does not support embedding interactive HTML directly in READMEs for security reasons.

#### 1. Copy & Paste this Snippet
Add this to your `README.md`:

```markdown
[![Interactive Profile Card](https://img.shields.io/badge/Interactive-Profile%20Card-blue?style=for-the-badge&logo=github)](https://github-profile-widget.vercel.app/?lucaspereirasouza&theme=black)
```


#### 2. Advanced: URL Options
You can link directly to your card using this format:
`https://your-deployment.vercel.app/?YOUR_USERNAME&theme=black`

*   **Theme**: Use `&theme=black` for dark mode.
*   **Username**: You can use `?username=name` or just `?name`.

---

### 🛠️ Troubleshooting: "Invalid upstream response (401)"

If you see a **401 Unauthorized** error when clicking the link or if the badge fails to load, it is likely because **Vercel Deployment Protection** is enabled.

**How to fix:**
1.  Go to your **Vercel Dashboard**.
2.  Select your `github-profile-widget` project.
3.  Go to **Settings** > **Deployment Protection**.
4.  Ensure **Vercel Authentication** is **Disabled** for both Production and Preview environments.
5.  Save changes.

---

### Live [demo and configuration](https://piotrl.github.io/github-profile-card/demo?username=piotrl)

### [Changelog](https://github.com/piotrl/github-profile-card/releases)

## Quick install (for websites)

Include script and style just before `</body>` tag:

```html
<script type="text/javascript" src="https://github-profile-widget.vercel.app/dist/gh-profile-card.min.js"></script>
```

Include HTML code anywhere you would like to place widget:

```html
<div id="github-card" data-username="YOUR_GITHUB_USERNAME"></div>
```

## Configuration options

| HTML option (`data-` prefix) | JavaScript option  | Default                     | Details                                                                                                                          |
| ---------------------------- | ------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `username`                   | `username`         | None                        | GitHub profile username                                                                                                          |
| `theme`                      | `theme`            | `light`                     | Theme to use (`light` or `black`)                                                                                                |
| `sort-by`                    | `sortBy`           | `stars`                     | Repositories sorting method (`stars` or `updateTime`)                                                                            |
| `max-repos`                  | `maxRepos`         | `5`                         | Amount of listed repositories. `0` disables section                                                                              |
| `header-text`                | `headerText`       | `Most starred repositories` | Text label above repositories list                                                                                               |
| `hide-top-languages`         | `hideTopLanguages` | `false`                     | Avoids heavy network traffic for calculating `Top Languages` section. Recommended for profiles with huge amount of repositories. |

## FAQ

- **How language statistic is built?**
  It is based on 10 last updated repositories, to represent your current interests.

## Feedback
I love feedback, send me one!
- show me website on which you're using this widget: [leave comment](https://github.com/piotrl/github-profile-card/issues/15)
- create [new issue](https://github.com/piotrl/github-profile-card/issues/new)
