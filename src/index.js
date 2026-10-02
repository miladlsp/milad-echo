function acceptsJson(request) {
	const accept = request.headers.get("Accept") || "";
	return accept
		.split(",")
		.map((part) => part.split(";")[0].trim().toLowerCase())
		.some((type) => type === "application/json" || type.endsWith("+json"));
}

export default {
	async fetch(request) {
		if (acceptsJson(request)) {
			return new Response("{}", {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
		return new Response(null, { status: 200 });
	},
};
