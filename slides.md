# SQL order (PostgreSQL)

We should not make any assumptions about the order of rows if we do not explicitly use an `ORDER BY` clause.

The order might change due to changes to index the execution plan the database planner decides to use, or the physical order of rows (which changes when updating/deleting/vacuuming, for example).


## Physical order


### Example

1. A `names` table that would "normally" return A, B, C, D, and E (according to their insertion order).
2. B is modified (renamed from Bob to Barbara).
3. The new order is A, C, D, E, B.

**Order is unguaranteed.**

```sql
CREATE TABLE names (
    id int primary key generated always as identity,
    value text
);

INSERT INTO names (value) VALUES
    ('alice'),
    ('bob'),
    ('ciara'),
    ('diana'),
    ('emma');

/* 1. */
SELECT * FROM names;

/* 2. */
UPDATE names SET value = 'barbara' WHERE id = 2;
/* Optional: */
VACUUM names;

/* 3. */
SELECT * FROM names;
```


## Index only scans

A train(wreck) of thought (hypothesis):
- Generate unordered rows, small
- Results are unordered
- It uses seq search
- Add index
- still uses seq search
- Add lotta data
- Results are ordered
- It uses index which is sorted

```sql
CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INTEGER,
    description TEXT DEFAULT repeat(md5(random()::text), 3)
);
```

```sql
/* C > D > E > A > B */
INSERT INTO characters(name, age)
    VALUES
    ('Ciel', 13),
    ('Damian', 45),
    ('Edward', 18),
    ('Ash', 777),
    ('Baldroy', 37);
```

```sql
-- Insert 10,000 random entries
INSERT INTO characters (name, age)
SELECT
    -- a random name starting with A-Z
    chr(65 + floor(random() * 26)::integer) || substr(md5(random()::text), 1, 9) AS name,
    -- a random age between 1 and 80
    floor(random() * 80 + 1)::integer AS age
FROM
    generate_series(1, 100000);
```

```sql
CREATE INDEX idx_characters_age ON characters(age);
```

```sql
CREATE INDEX idx_characters_age_and_name ON characters(age, name);
-- Or:
--CREATE INDEX idx_characters_age_include_name ON characters(age) INCLUDE (name);
```

```sql
/* To update stats */
VACUUM ANALYZE;
```

```sql
/* See most common values, etc. */
SELECT attname, inherited, n_distinct,
       array_to_string(most_common_vals, E'\n') as most_common_vals
FROM pg_stats
WHERE tablename = 'characters';
```

### Results

TLDR:
- Limit 10 uses seq scan, this is why we get insertion order
- Limit 100 uses index scan, this is why we get ordered results.
(by default, Postgres uses B-Tree, which is ordered).

```sql
SELECT name, age
FROM characters
WHERE age >= 40
LIMIT 10;
```

Output:
```
    name    | age
------------+-----
 Damian     |  45
 Ash        | 777
 C113ba9012 |  74
 K51ab540bc |  77
 X3f9830365 |  55
 Ga09ba1080 |  52
 Qab3bc9efd |  50
 Dff693611d |  56
 Zb97ed23e8 |  62
 Zcc58a6e54 |  66
(10 rows)
```

```
tea=# explain select name, age from characters where age >= 40 limit 10;
                               QUERY PLAN
------------------------------------------------------------------------
 Limit  (cost=0.00..0.60 rows=10 width=14)
   ->  Seq Scan on characters  (cost=0.00..3069.06 rows=50846 width=14)
         Filter: (age >= 40)
(3 rows)
```

---

```sql
SELECT name, age
FROM characters
WHERE age >= 40
LIMIT 100;
```

Output:
```
    name    | age
------------+-----
 A005b57af5 |  40
 A009487c63 |  40
 A037d432b8 |  40
 A098cfebe1 |  40
 A0cc82835b |  40
 A0fca1de67 |  40
 A123cd9854 |  40
 ...
 Da74a0a817 |  45
 Dad4cadcd6 |  45
 Damian     |  45
 Db1e6e48c2 |  45
...
```

```
tea=# explain select name, age from characters where age >= 40 limit 100;
                                                   QUERY PLAN
-----------------------------------------------------------------------------------------------------------------
 Limit  (cost=0.42..5.76 rows=100 width=14)
   ->  Index Only Scan using idx_characters_age_and_name on characters  (cost=0.42..2718.22 rows=50846 width=14)
         Index Cond: (age >= 40)
(3 rows)
```


## Futher reading

- [PostgreSQL: Documentation: 16: 7.5. Sorting Rows (ORDER BY)](https://www.postgresql.org/docs/current/queries-order.html)
> If sorting is not chosen, the rows will be returned in an unspecified order. The actual order in that case will depend on the scan and join plan types and the order on disk, but it must not be relied on. A particular output ordering can only be guaranteed if the sort step is explicitly chosen.

- [PostgreSQL: Documentation: 16: 11.9. Index-Only Scans and Covering Indexes](https://www.postgresql.org/docs/current/indexes-index-only-scans.html)

---

END.
