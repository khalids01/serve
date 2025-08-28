# 🚀 Serve - Open Source File Storage

**100% Free & Open Source** • Fast, secure, and scalable file storage server built for developers who need reliable file storage without vendor lock-in.

> 🎯 **Use it for anything legal** - Commercial projects, personal use, SaaS applications, or as a foundation for your own file storage solution. No restrictions, no licensing fees.

[![GitHub stars](https://img.shields.io/github/stars/khalids01/serve?style=social)](https://github.com/khalids01/serve)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/khalids01/serve/pulls)
[![Contributors](https://img.shields.io/github/contributors/khalids01/serve)](https://github.com/khalids01/serve/graphs/contributors)

## ✨ Features

- **🔐 Magic Link Authentication** - Passwordless authentication using better-auth
- **📁 Multi-Format Support** - Images, videos, audio, documents, and more
- **🎨 Automatic Optimization** - Image variants and compression out of the box
- **🏢 Multi-Tenant Architecture** - Organize files by applications and projects
- **🔒 Secure by Default** - Built-in security best practices
- **🚀 High Performance** - Optimized for speed and scalability
- **📊 Real-time Analytics** - Track usage and performance metrics
- **🎯 API-First Design** - RESTful APIs for easy integration
- **🔧 Self-Hosted** - Complete control over your data
- **🌐 Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- **📜 Recent Activity** - Audit logs for uploads and deletions per application
- **🗂️ Files Management UI** - List/grid views, preview, and safe delete with confirmation

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (configurable for PostgreSQL/MySQL)
- **Authentication**: Better-Auth with Magic Link
- **File Storage**: Local filesystem (S3 compatible coming soon)
- **UI Components**: Radix UI, Lucide Icons
- **Deployment**: Vercel, Docker, or self-hosted

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Bun (recommended) or npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khalids01/serve.git
   cd serve
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3003
   DATABASE_URL="file:./dev.db"
   BETTER_AUTH_SECRET="your-secret-key"
   # Add email configuration for magic links
   ```

4. **Initialize the database**
   ```bash
   bun run db:push
   # or npx prisma db push
   ```

5. **Start the development server**
   ```bash
   bun dev
   # or npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3003](http://localhost:3003)

## 📖 Usage

### Basic File Upload

```typescript
// Upload a file via API
const formData = new FormData();
formData.append('file', file);
formData.append('applicationId', 'my-app');
formData.append('tags', JSON.stringify(['profile', 'avatar']));

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('File uploaded:', result.url);
```

### Recent Activity (Audit Logs)

Fetch audit logs for an application:

```ts
// GET recent activity
const logsRes = await fetch(`/api/audit-logs?applicationId=<APP_ID>&limit=10`)
const { logs, pagination } = await logsRes.json()

// Log shape example
// {
//   id, action: 'UPLOAD' | 'DELETE', targetId, metadata: { filename, originalName }, createdAt, ip, userAgent
// }
```

Events are recorded for file uploads and deletions.

### Files Management

List images by application and delete with confirmation:

```ts
// List files for an application
const imagesRes = await fetch(`/api/images?applicationId=<APP_ID>&limit=50`)
const { images } = await imagesRes.json()

// Preview/serve content with optional resize
// Original
const url = `/api/images/${images[0].id}/content`
// Resized thumbnail (fit inside width)
const thumb = `/api/images/${images[0].id}/content?w=320`

// Delete a file (removes from storage + DB)
await fetch(`/api/images/${images[0].id}`, { method: 'DELETE' })
```

### Authentication

```typescript
import { signIn } from '@/lib/auth-client';

// Send magic link
await signIn.magicLink({ 
  email: 'user@example.com',
  callbackURL: '/dashboard'
});
```

## 🛠️ Development

### Project Structure

```
serve/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   └── dashboard/      # Dashboard pages
│   ├── components/         # React components
│   │   ├── auth/          # Auth-related components
│   │   ├── core/          # Core UI components
│   │   └── ui/            # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility libraries
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── rules/                 # Development guidelines
```

### Available Scripts

```bash
# Development
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server

# Database
bun db:push          # Push schema changes
bun db:studio        # Open Prisma Studio
bun db:migrate       # Run migrations

# Code Quality
bun lint             # Run linter
bun format           # Format code
```

## 🤝 Contributing

**We ❤️ contributions!** This project thrives because of amazing developers like you. Whether you're a beginner or expert, there's a place for you here.

### 🌟 Why Contribute?

- **Learn & Grow** - Work with modern tech stack (Next.js 15, React 19, TypeScript)
- **Make an Impact** - Your code will help developers worldwide
- **Build Your Portfolio** - Showcase your open-source contributions
- **Join the Community** - Connect with like-minded developers

### 🚀 Quick Start for Contributors

1. **🍴 Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/serve.git
   cd serve
   ```

2. **📦 Install Dependencies**
   ```bash
   bun install  # or npm install
   ```

3. **🗄️ Setup Database**
   ```bash
   cp .env.example .env.local
   bun run db:push
   ```

4. **🔥 Start Developing**
   ```bash
   bun dev
   ```

### 💡 Ways to Contribute

| Type | Description | Good for |
|------|-------------|----------|
| 🐛 **Bug Fixes** | Fix issues, improve stability | Beginners |
| ✨ **Features** | Add new functionality | Intermediate |
| 📚 **Documentation** | Improve guides, add examples | All levels |
| 🎨 **UI/UX** | Design improvements, accessibility | Frontend devs |
| 🧪 **Testing** | Add tests, improve coverage | QA focused |
| 🔧 **DevOps** | CI/CD, Docker, deployment | Infrastructure |
| 🌐 **Integrations** | S3, CDN, third-party APIs | Backend devs |

### 🎯 Contribution Workflow

1. **📋 Pick an Issue** - Check [Good First Issues](https://github.com/khalids01/serve/labels/good%20first%20issue)
2. **💬 Discuss** - Comment on the issue to claim it
3. **🌿 Branch** - Create: `git checkout -b feature/your-feature`
4. **⚡ Code** - Follow our style guide and add tests
5. **✅ Test** - Run `bun lint` and `bun test`
6. **📤 Submit** - Open a PR with clear description
7. **🔄 Iterate** - Address feedback and get merged!

### 📝 Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: add S3 storage integration
fix: resolve upload timeout issue
docs: update API documentation
style: improve mobile responsiveness
test: add unit tests for auth module
```

### 🏆 Recognition

All contributors get:
- 📛 **Credit** in our contributors list
- 🎖️ **GitHub badge** on your profile
- 🌟 **Shoutout** in release notes
- 💼 **Portfolio piece** you can showcase

### 🤝 Code of Conduct

Be respectful, inclusive, and helpful. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Harassment or discrimination of any kind will not be tolerated.

## 📚 Documentation

- [API Documentation](docs/api.md) - Complete API reference
- [Deployment Guide](docs/deployment.md) - How to deploy Serve
- [Configuration](docs/configuration.md) - Environment and setup options
- [Contributing Guide](CONTRIBUTING.md) - Detailed contribution guidelines

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3003` |
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `BETTER_AUTH_SECRET` | Authentication secret key | Required |
| `UPLOAD_DIR` | Root directory for uploaded files | `uploads` |
| `ORIGINAL_MAX_DIM` | Max dimension for optimized originals (px) | `2560` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10_000_000` |
| `SMTP_HOST` | Email server host | Optional |
| `SMTP_PORT` | Email server port | Optional |

### Database Support

- **SQLite** (default) - Perfect for development and small deployments
- **PostgreSQL** - Recommended for production
- **MySQL** - Also supported

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/khalids01/serve)

### Docker

```bash
# Build the image
docker build -t serve .

# Run the container
docker run -p 3003:3003 serve
```

### Self-Hosted

1. Build the application: `bun build`
2. Set up your database
3. Configure environment variables
4. Start the server: `bun start`

## 📊 Roadmap

- [ ] **S3 Compatible Storage** - AWS S3, MinIO, etc.
- [ ] **Advanced Image Processing** - More optimization options
- [ ] **CDN Integration** - CloudFlare, AWS CloudFront
- [ ] **Webhook Support** - Real-time notifications
- [ ] **Admin Dashboard** - Advanced management interface
- [ ] **API Rate Limiting** - Built-in rate limiting
- [ ] **File Versioning** - Track file changes over time
- [ ] **Bulk Operations** - Upload and manage multiple files

## 📄 License & Legal

### 🆓 MIT License - Use Freely!

This project is licensed under the **MIT License** - one of the most permissive open-source licenses.

**✅ You CAN:**
- 💼 **Commercial Use** - Build and sell products using this code
- 🏢 **Private Use** - Use in your company's internal projects
- 🔄 **Modify** - Change anything to fit your needs
- 📦 **Distribute** - Share your modified versions
- 🎯 **Sublicense** - Include in proprietary software
- 🚀 **SaaS Applications** - Deploy as a service and charge users
- 🏗️ **White Label** - Rebrand and resell as your own product

**📋 You MUST:**
- 📝 Include the original license and copyright notice
- 🙏 Give credit to the original project (optional but appreciated)

**🚫 We provide NO WARRANTY:**
- Software is provided "as is"
- Use at your own risk
- No liability for damages

### 💡 Real-World Examples

**Startups & Companies:**
- Build your file storage SaaS
- Add file management to existing products
- Create industry-specific solutions

**Developers & Freelancers:**
- Use as foundation for client projects
- Customize for specific requirements
- Learn modern development patterns

**Organizations:**
- Self-host for data sovereignty
- Integrate with existing systems
- Avoid vendor lock-in

> 💬 **Questions about usage?** Open an [issue](https://github.com/khalids01/serve/issues) - we're happy to clarify!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Better-Auth](https://better-auth.com/) - Modern authentication library
- [Prisma](https://prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://radix-ui.com/) - Unstyled, accessible components

## 💬 Community & Support

### 🆘 Need Help?

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/khalids01/serve/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/khalids01/serve/issues/new?template=feature_request.md)
- ❓ **Questions**: [GitHub Discussions](https://github.com/khalids01/serve/discussions)
- 📚 **Documentation**: Check our [Wiki](https://github.com/khalids01/serve/wiki)

### 🌐 Connect with Us

- 🐙 **GitHub**: [@khalids01](https://github.com/khalids01)
- 🐦 **Follow Updates**: Watch this repo for releases
- ⭐ **Show Support**: Star the project if you find it useful!

### 🚀 Enterprise Support

Need custom features, priority support, or consulting?
- 📧 **Contact**: Open an issue with the "enterprise" label
- 🤝 **Custom Development**: We can help build specific features
- 🎯 **Consulting**: Architecture, deployment, and scaling advice

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps others discover the project and motivates continued development.

[![Star History Chart](https://api.star-history.com/svg?repos=khalids01/serve&type=Date)](https://star-history.com/#khalids01/serve&Date)

---

<div align="center">
  <p>Built with ❤️ by the open source community</p>
  <p>
    <a href="https://github.com/khalids01/serve/stargazers">⭐ Star</a> •
    <a href="https://github.com/khalids01/serve/issues">🐛 Report Bug</a> •
    <a href="https://github.com/khalids01/serve/issues">💡 Request Feature</a>
  </p>
</div>
