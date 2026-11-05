# Bilal Ahmed — personal website

Live site: https://bilalhsp.github.io/

Plain HTML, CSS, and JavaScript, served from the root of `main` by GitHub Pages. `.nojekyll` keeps deployment static; no package installation or build step is required. The default repository branch may differ from the Pages publishing branch: use `main` for website updates.

## Local preview

Run `python -m http.server 5173` in this folder and open http://localhost:5173. Use HTTP rather than opening index.html directly, because the site fetches content.json.

## Updating content

Edit `index.html` for biography, interests, publications, and teaching; `style.css` for appearance; and root `content.json` for announcements, projects, and writing. Commit and push to `main` to publish.

The content editor is available directly at https://bilalhsp.github.io/studio.html. It keeps drafts in the current browser only. Save and preview your draft, download content.json, then replace the root content.json on `main` with that file and commit. It contains no GitHub credentials and cannot modify the published site by itself.

The appearance selector offers Light, Dark, and Auto. Auto follows the operating system, and the icon reflects the effective appearance. Search runs in the browser and includes all announcements, project write-ups, writing summaries, biography, publications, and teaching. Linked external articles are not indexed in full.

## Deployment and rollback

Keep Pages configured as **Deploy from a branch → main → /(root)**. No extra Actions workflow is needed for this buildless site.

The prior website is preserved in Git history and the pre-migration backup branch. Existing legacy source folders and assets remain for reference and old links. They no longer generate the homepage. The inherited CNAME pointing to another person's domain was removed; the site uses bilalhsp.github.io.

Previous paths such as /blogs/, /publications/, /cv/, and the two publication pages redirect to the new destinations. Existing download paths remain available, though the homepage has no CV links. Independent project repositories and their Pages sites are unaffected.

To roll back, revert the migration commit on main and push the revert; do not force-push over the history.

## Attribution

Profile content, portrait, publications, and figures came from Bilal's previous website and GitHub profile. Recent award and teaching announcements were provided by Bilal. Article dates were verified against the original publications.

Profile icons use Font Awesome 5 Brands and Academicons glyphs from the SVG fonts already bundled in the original site. Google Fonts has system-font fallbacks. The original template's LICENSE is retained.
