## Stackbuld frontend assessment
# NextJS Proficiency
- The task comprises of 4 routes;

```bash
- /
- products
- add-products
- edit-products
```
2 of which is dynamically rendered using params and query.
- An api route handler specifically for uploading images was created.
- The use of a navbar and footer conponent to wrap the whole app using the `layout.tsx` was implemented

# Typescript Usage
- The use of `.tsx, .ts` was used throughout the app

# SEO Compliance
- Each page's metadata is applied in the `layout.tsx` file in their respective directories.
- Using `next-sitemap` a stiemap and arobots.txt file was generated to improve the seo indexing



# Performance Optimization
- The project uses Dexie as a temprary db for storing the product data and is initialized with a bunch of data stored in the `@app/db.ts` file

# Tailwind CSS Integration
- Reusable component styling was achieved
- Responsive design using Tailwind’s utility-first approach was achieved

# Product Management Functionality
- Features for users to edit existing products was achieved.
- Features for users to delete products was achieved.
- Features for users to add new products was achieved partially due to the nature of google api security for test applications and time considerations, I would rather discuss the approach in a later interview.


