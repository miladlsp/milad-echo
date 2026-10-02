import { test } from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const call = (init) => worker.fetch(new Request("https://example.com/any/path", init));

test("returns {} when Accept is application/json", async () => {
	const res = await call({ headers: { Accept: "application/json" } });
	assert.equal(res.status, 200);
	assert.equal(res.headers.get("Content-Type"), "application/json");
	assert.equal(await res.text(), "{}");
});

test("returns {} when JSON is one of several accepted types", async () => {
	const res = await call({ headers: { Accept: "text/html, application/json;q=0.9" } });
	assert.equal(res.status, 200);
	assert.equal(await res.text(), "{}");
});

test("returns {} for +json media types", async () => {
	const res = await call({ headers: { Accept: "application/ld+json" } });
	assert.equal(await res.text(), "{}");
});

test("returns empty body when Accept is not JSON", async () => {
	const res = await call({ headers: { Accept: "text/html" } });
	assert.equal(res.status, 200);
	assert.equal(await res.text(), "");
});

test("returns empty body when no Accept header", async () => {
	const res = await call();
	assert.equal(res.status, 200);
	assert.equal(await res.text(), "");
});

test("accepts any method", async () => {
	for (const method of ["POST", "PUT", "DELETE", "PATCH"]) {
		const res = await call({ method, headers: { Accept: "application/json" }, body: method === "DELETE" ? undefined : "x" });
		assert.equal(res.status, 200);
		assert.equal(await res.text(), "{}");
	}
});

test("returns empty body when JSON is explicitly refused with q=0", async () => {
	const res = await call({ headers: { Accept: "text/html, application/json;q=0" } });
	assert.equal(res.status, 200);
	assert.equal(await res.text(), "");
});

test("sets Vary: Accept on all responses", async () => {
	assert.equal((await call({ headers: { Accept: "application/json" } })).headers.get("Vary"), "Accept");
	assert.equal((await call()).headers.get("Vary"), "Accept");
});
