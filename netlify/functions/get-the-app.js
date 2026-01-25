exports.handler = async (event) => {
  const USER = process.env.DEMO_USER || "demo";
  const PASS = process.env.DEMO_PASS || "newsery";

  const auth = event.headers.authorization || event.headers.Authorization;

  // No auth -> ask for it
  if (!auth || !auth.startsWith("Basic ")) {
    return {
      statusCode: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Newsery Demo"',
        "Cache-Control": "no-store",
      },
      body: "Authentication required.",
    };
  }

  // Decode basic auth
  const base64 = auth.replace("Basic ", "").trim();
  let decoded = "";
  try {
    decoded = Buffer.from(base64, "base64").toString("utf8");
  } catch (e) {
    return {
      statusCode: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Newsery Demo"',
        "Cache-Control": "no-store",
      },
      body: "Invalid auth.",
    };
  }

  const [user, pass] = decoded.split(":");

  // Check
  if (user !== USER || pass !== PASS) {
    return {
      statusCode: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Newsery Demo"',
        "Cache-Control": "no-store",
      },
      body: "Wrong credentials.",
    };
  }

  // Success -> go to download page
  return {
    statusCode: 302,
    headers: {
      Location: "/download.html",
      "Cache-Control": "no-store",
    },
    body: "",
  };
};
