# milad-echo
A test server that just returns 200

A Cloudflare Worker that accepts every request (any method, any path) and responds with `200 OK`:

- If the `Accept` header includes a JSON media type (`application/json` or `*+json`), the body is `{}` with `Content-Type: application/json`.
- Otherwise, the body is empty.

## Usage

```sh
npm install
npm run dev     # run locally with wrangler
npm test        # run tests
npm run deploy  # deploy to Cloudflare
```

