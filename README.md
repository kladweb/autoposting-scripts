# Tampermonkey Script Builder 🛠️

This project helps automate the generation of multiple Tampermonkey userscripts that share common logic but have different headers (e.g., for different accounts or environments).

Instead of editing each script manually, you can now update a single template, and generate all output files with a single build command.

---

## ⚙️ How It Works

- You edit shared logic inside the `templates/` folder.
- The **most recently modified** template file is selected automatically.
- Each file inside the `headers/` folder contains a unique Tampermonkey header (first ~13 lines of code).
- On build, each header is combined with the selected template (excluding wrapping comments like `// === TEMPLATE START ===` and `// === TEMPLATE END ===`).
- Final scripts are saved into `dist/` with `_fin` suffix (e.g., `scriptA_fin.js`).

---

## 📦 Example

If you have:

- `headers/scriptA.js`
- `headers/scriptB.js`

and the latest modified template is `templates/template2.js`, then `dist/` will contain:

- `scriptA_fin.js`
- `scriptB_fin.js`

Each file will contain its original header plus the shared template code.

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

After that, every `git commit` will automatically trigger a rebuild.  
If you want to customize or disable this behavior, edit the file: `.husky/pre-commit`.

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
