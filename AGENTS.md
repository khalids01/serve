# UI conventions

Use the installed shared shadcn components from `src/components/ui` for interactive controls, including Button, Input, Select, Checkbox, RadioGroup, Switch, and Accordion. Do not introduce native HTML form controls or buttons when a shared component exists, including hidden upload inputs. Use semantic HTML for page structure and content.

Keep global and storage configuration on the Settings page. The Storage page is for browsing drives and files. Preserve server-side authorization when changing settings visibility.

# Package releases

Keep the published serve-server, serve-client, and serve-react packages on the same version. Update React's serve-client dependency to that exact version and run `bun run verify` in `npm_pkg` before publishing the verified artifacts.
