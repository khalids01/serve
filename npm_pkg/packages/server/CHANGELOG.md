# Changelog

## 0.3.0 (unreleased)

- Per-upload destination selection and destination discovery.
- Proxy/Direct delivery remains controlled by Serve settings.


## 0.2.0 (published)

- Direct signed S3 delivery through stable Serve URLs; stored transforms are reused.
- Framework-independent serve-client package; React hooks and image helpers use it.


## 0.1.0

- Initial typed server SDK: upload/list/get/delete, crop-as-new, image URLs and browser-token minting.
- Authenticated Fetch token adapter with same-origin checks and no-store responses.
- Public Host handling for token routes behind reverse proxies with internal Request URLs.
- ESM/CommonJS output with separate declarations, Node 20+ support and Fetch injection.
- Public-file delivery with application-scoped management and typed HTTP errors.
