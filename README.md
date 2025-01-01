# My App

Welcome to My App! This project is built using Next.js, Sanity, and Tailwind CSS. Below you'll find information on how to set up and run the project, as well as an overview of the project's structure and dependencies.

## Table of Contents

- [My App](#my-app)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Scripts](#scripts)
  - [Project Structure](#project-structure)
  - [Dependencies](#dependencies)
  - [Environment Variables](#environment-variables)
  - [License](#license)

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/my-app.git
cd my-app
pnpm install
```

## Scripts

Here are some useful scripts you can run:

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the project for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for linting errors.
- `pnpm typegen`: Generates TypeScript definitions from the Sanity schema.

## Project Structure

Here's an overview of the project's structure:

```
my-app/
├── app/
│   ├── (root)/
│   ├── studio/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
├── components/
│   ├── ui/
│   ├── skeleton.tsx
│   ├── textarea.tsx
│   ├── toast.tsx
├── lib/
│   ├── utils.ts
│   ├── validation.ts
├── sanity/
│   ├── schema.ts
│   ├── structure.ts
│   ├── types.ts
│   ├── extract.json
│   ├── sanity.config.ts
├── .eslintrc.json
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── tailwind.config.ts
```

## Dependencies

Here are some of the key dependencies used in this project:

- `next`: ^15.0.3-canary.1
- `react`: ^19.0.0-rc-69d4b800-20241021
- `react-dom`: ^19.0.0-rc-69d4b800-20241021
- `sanity`: ^3.62.3
- `tailwindcss`: ^3.4.1
- `@sanity/vision`: ^3.62.3
- `@sentry/nextjs`: ^8.42.0
- `@tailwindcss/typography`: ^0.5.15

For a complete list of dependencies, refer to the `package.json` file.

## Environment Variables

The project requires the following environment variables to be set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`

You can set these variables in a `.env` file at the root of the project.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Happy coding!