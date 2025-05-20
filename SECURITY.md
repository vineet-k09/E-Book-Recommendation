# 🔐 Security Policy

## 🚨 Reporting a Vulnerability

If you find a security issue—such as an exposed API key, access control flaw, or data leak—please report it responsibly.

### 📬 Contact

Please contact [@vineet-k09](https://github.com/vineet-k09) directly via GitHub or raise an issue privately (no public exposure of exploits).

## 🔒 Scope

This is a **local, educational project**, and no production data or services are exposed online.

Still, here’s what we try to secure:

- No hardcoded secrets in source files
- MongoDB secured locally, not exposed on the web
- No user passwords stored in plaintext
- `.env` file not committed

## 🧪 Development Practices

- Use `dotenv` to manage sensitive keys
- Limit data exports to trusted sources
- Prefer HTTPS endpoints for any external API (like Google Books)

---

This project is a learning sandbox, not a commercial-grade product. But good security hygiene still matters!
