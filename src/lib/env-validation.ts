// Environment validation utility
export function validateEnvironment() {
  const required = [
    "NEXTAUTH_URL",
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "MONGODB_URI",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate NEXTAUTH_URL format
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (nextAuthUrl && !nextAuthUrl.startsWith("http")) {
    throw new Error(
      "NEXTAUTH_URL must be a valid URL starting with http:// or https://"
    );
  }

  // Warn if using localhost in production
  if (
    process.env.NODE_ENV === "production" &&
    nextAuthUrl?.includes("localhost")
  ) {
    console.warn("⚠️  WARNING: NEXTAUTH_URL is set to localhost in production");
  }
}
