# Documentation

Complete documentation for Codex Orchestrator/Worker Architecture

---

## 📚 Available Documentation

### [SHORTCODES.md](SHORTCODES.md)
**Communication Protocol for User ↔ Claude collaboration**

Quick shortcodes to streamline workflows:
- `ccc` - Create context & compact conversation
- `nnn` - Smart planning
- `gogogo` - Execute plan
- `rrr` - Retrospective
- `lll` - List status

**When to read:**
- Starting new sessions
- Learning the protocol
- Understanding state management

---

### [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
**Complete project overview and guide**

Comprehensive documentation covering:
- Directory layout
- Script descriptions
- Usage examples
- Workflows
- Best practices
- Maintenance guide

**When to read:**
- First time setup
- Understanding architecture
- Looking for specific features
- Troubleshooting

---

### [COMMIT_GUIDE.md](COMMIT_GUIDE.md)
**Git commit standards and conventional commits**

Complete guide for:
- Commit message format
- Conventional commit types
- Emoji usage (required)
- Subject line rules
- Common mistakes to avoid
- VSCode integration

**When to read:**
- Before making commits
- Setting up development environment
- Learning team standards
- Troubleshooting commit lint errors

---

### [shadcn-ui/](shadcn-ui/)
**Component library documentation**

Complete shadcn/ui integration guide covering:
- Component documentation and usage patterns
- Form best practices and validation
- Layout and navigation patterns
- Accessibility guidelines (WCAG 2.1 compliance)
- Migration patterns from HTML to shadcn/ui

**Key documentation:**
- **[README.md](shadcn-ui/README.md)** - Complete integration guide
- **[Components](shadcn-ui/components/)** - Individual component documentation
- **[Patterns](shadcn-ui/patterns/)** - Usage patterns and best practices

**When to read:**
- Setting up new components
- Implementing forms and validation
- Creating responsive layouts
- Ensuring accessibility compliance
- Migrating existing UI components

---

## 🚀 Getting Started

**New to this project?**
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) first
2. Then learn [SHORTCODES.md](SHORTCODES.md) protocol
3. Try running `examples/01-quick-task.sh`
4. Start using shortcodes in conversations

**Quick reference:**
- Main docs: [../CLAUDE.md](../CLAUDE.md)
- Examples: [examples/README.md](examples/README.md)
- Templates: [templates/README.md](templates/README.md)

---

## 📖 Documentation Map

```
docs/
├── README.md                 # This file - documentation index
├── SHORTCODES.md            # Communication protocol
├── PROJECT_STRUCTURE.md     # Complete project guide
└── COMMIT_GUIDE.md          # Git commit standards

Related documentation:
├── ../CLAUDE.md             # Main architecture overview
├── ../examples/README.md    # Examples guide
└── ../templates/README.md   # Templates guide
```

---

*For questions or issues, refer to the main [CLAUDE.md](../CLAUDE.md)*
