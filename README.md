# Demystifying SQL Order

A presentation, a set of PostgreSQL experiments, Web-based demo(s)...

Take away:
SQL order is unguaranteed, but it is not random.


## Remarks

- To ensure reproducibility, we specify a seed at the start of the experiment:
```sql
SELECT setseed(0.666);
```


## Technologies used

The live demo relies on the following:

- Quasar v2

    * [Carousel](https://quasar.dev/vue-components/carousel)

    * [Stepper](https://quasar.dev/vue-components/stepper)
        * Stepper (horizontal)

    * [Table](https://quasar.dev/vue-components/table)
        * Table (color custom cells with our predefined values)

    * [QMarkdown](https://github.com/quasarframework/quasar-ui-qmarkdown)
        + PrismJS
        + `markdown-it`

- `pgmock`


### Postgres in the browser options

- [x] ~~PGlite~~ https://github.com/electric-sql/pglite

    * Package: `@electric-sql/pglite 0.2.0-alpha.3`
    Running `SELECT version();` returned `PostgreSQL 16.3 on x86_64-pc-linux-gnu, compiled by emcc (Emscripten gcc/clang-like replacement + linker emulating GNU ld) 3.1.64-git (a1fe3902bf73a3802eae0357d273d0e37ea79898), 32-bit`.

    * Compiled to Wasm using Emscripten.

    * It works fine and is even fast! However, it refuses to use _seq scan_.

    * I even tried to adjuct costs of the default _tablespaces_
    (`ALTER TABLESPACE pg_default SET (seq_page_cost = 1, random_page_cost = 55);`).

    * It cannot create tablespaces. I hoped to `CREATE INDEX` and use a slow `TABLESPACE` (see https://www.postgresql.org/docs/current/sql-createindex.html).

- pgmock https://github.com/stack-auth/pgmock

    * Live demo: https://stack-auth.github.io/pgmock/

    * VM-based.

    * Kinda slow, but it works as expected.

    * Package: `pgmock 1.0.3`.
    Running `SELECT version();` returned `PostgreSQL 14.5 on i686-buildroot-linux-musl, compiled by i686-buildroot-linux-musl-gcc.br_real (Buildroot 2022.08) 12.1.0, 32-bit`.

- [ ] ~~Postgres WASM~~ https://github.com/snaplet/postgres-wasm

    * "This repository has been archived by the owner on Sep 19, 2024. It is now read-only."


## Credits

- Slide border: "Black futuristic free border" by veeForu
https://www.veeforu.com/border-png/black-futuristic-free-border-png/

- Icon is AI-generated

<details>
<summary>Icon prompts</summary>

### Icon prompts

1. Create an icon for a PostgreSQL project, neon vibes, blue elephant, flat, minimalist, abstract, white background
https://huggingface.co/spaces/stabilityai/stable-diffusion-3-medium
![](assets/1.webp)

2. Create an icon for a PostgreSQL project, neon vibes, blue elephant, flat, minimalist, abstract, chaotic, white background
https://huggingface.co/spaces/mukaist/DALLE-4K
![](assets/2.png)

3. Create an icon for a PostgreSQL project, neon vibes, blue elephant, flat, minimalist, abstract, chaotic, hexagon motif, white background
https://huggingface.co/spaces/mukaist/DALLE-4K
![](assets/3.png)

4. Create an icon for a PostgreSQL project, neon vibes, blue elephant, flat, minimalist, abstract, chaotic, hexagon motif, abstract shape art, white background, transparent background color
https://huggingface.co/spaces/mukaist/DALLE-4K
![](assets/4.png)

5. Create a favicon for a PostgreSQL project, neon vibes, blue elephant, flat, minimalist, abstract, chaotic, hexagon motif, abstract shape art, white background, transparent background color
![](assets/5.png)

6. Create a favicon for a PostgreSQL project, neon vibes, blue elephant, flat, minimalist, abstract, chaotic, hexagon motif, abstract shape art, white background, transparent background color
![](assets/6.png)

</details>


## License

WTFPL
