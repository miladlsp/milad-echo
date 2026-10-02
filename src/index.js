function acceptsJson(request) {
	const accept = request.headers.get("Accept") || "";
	return accept.split(",").some((part) => {
		const [type, ...params] = part.split(";").map((s) => s.trim().toLowerCase());
		const q = params.find((p) => p.startsWith("q="));
		if (q !== undefined && !(parseFloat(q.slice(2)) > 0)) {
			return false;
		}
		return type === "application/json" || type.endsWith("+json");
	});
}

export default {
	async fetch(request) {
		if (acceptsJson(request)) {
			return new Response("{}", {
				status: 200,
				headers: { "Content-Type": "application/json", Vary: "Accept" },
			});
		}
		return new Response(null, { status: 200, headers: { Vary: "Accept" } });
	},
};
