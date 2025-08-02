# Tampermonkey Script Builder 🛠️

This project helps automate the generation of multiple Tampermonkey userscripts that share common logic but have different headers (e.g., for different accounts or environments).

Instead of editing each script manually, you can now update a single template, and generate all output files with a single build command.

---

## 🚀 Usage

### 1. Install dependencies
```bash
npm install
```

### 2. Run build manually
```bash
npm run build
```

This will:
- Select the most recently modified file from `templates/`
- Insert its logic into all headers from `headers/`
- Save result as `*_fin.js` files in `dist/`

### 3. (Optional) Auto-build on Git commit

The project uses [Husky](https://typicode.github.io/husky) to run `npm run build` automatically before each commit.

To activate Husky:
```bash
npm run prepare
```

### 4. Push changes
```bash
git push origin main
```

---

## ✅ Benefits

- Save time on editing duplicated userscripts
- Keep shared logic in a single place
- Reduce bugs and inconsistencies
- Fully compatible with Tampermonkey

---

## 🧠 Tips

- Place shared logic between `// === TEMPLATE START ===` and `// === TEMPLATE END ===` in your templates.
- You can use any file names inside `templates/` — the most recently edited file will be used automatically.

---

Happy coding!  
🧩✨ Made for productivity and clarity.
